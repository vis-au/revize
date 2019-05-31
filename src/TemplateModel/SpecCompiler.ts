import { TopLevelSpec } from 'vega-lite';

import { Data, isNamedData } from 'vega-lite/build/src/data';
import { Datasets } from 'vega-lite/build/src/spec/toplevel';
import { NamedDataSourceNode } from '../DataModel/Datasets/NamedDataSourceNode';
import { CompositionTemplate } from './CompositionTemplate';
import { ConcatTemplate } from './ConcatTemplate';
import { FacetTemplate } from './FacetTemplate';
import { LayerTemplate } from './LayerTemplate';
import { Composition } from './LayoutType';
import { PlotTemplate } from './PlotTemplate';
import { RepeatTemplate } from './RepeatTemplate';
import { getAbstraction, getAllDatasetsInHierarchy, getJoinedDatasetsOfChildNodes } from './SpecUtils';
import { Template } from './Template';


export class SpecCompiler {
  public getBasicSchema(template?: Template): any {
    // check for empty templates, which should also generate valid specs
    if (template && template.visualElements.length === 0 && template.parent === null) {
      return {
        $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
        mark: 'area', // could be anything, since data will be empty
        encoding: {}
      };
    }
    return {
      $schema: 'https://vega.github.io/schema/vega-lite/v3.json'
    };
  }

  private setCompositionProperties(schema: any, template: CompositionTemplate) {
    if (template.columns !== undefined) {
      schema.columns = template.columns;
    }
    if (template.spacing !== undefined) {
      schema.spacing = template.spacing;
    }

    return schema;
  }

  private setToplevelProperties(schema: any, template: Template, includeData: boolean = true) {
    if (includeData && !!template.data) {
      schema.data = template.data;
      schema.transform = template.dataTransformationNode.getAllChildNodes().map(node => node.transform);
    }
    if (includeData && !!template.datasets) {
      schema.datasets = template.datasets;
    }
    if (template.bounds !== undefined) {
      schema.bounds = template.bounds;
    }
    if (template.height !== undefined) {
      schema.height = template.height;
    }
    if (template.width !== undefined) {
      schema.width = template.width;
    }
    if (template.config !== undefined) {
      schema.config = template.config;
    }

    if (template instanceof CompositionTemplate) {
      schema = this.setCompositionProperties(schema, template);
    }

    return schema;
  }

  private getRootTemplate(template: Template) {
    let workingNode = template;

    while (workingNode.parent !== null) {
      workingNode = workingNode.parent;
    }

    return workingNode;
  }

  private abstractCompositions(schema: any, compositionProperty: string): TopLevelSpec {
    const abstraction: any = getAbstraction(schema);

    if (compositionProperty === 'spec' || compositionProperty === 'facet') {
      schema[compositionProperty] = abstraction;
    } else {
      schema[compositionProperty] =  [ abstraction ];
    }

    return schema;
  }

  private applyRepeatLayout(template: RepeatTemplate, schema: any): TopLevelSpec {
    schema = this.abstractCompositions(schema, 'spec');

    // parent must be repeat template to reach this branch
    schema.repeat = (template.parent as RepeatTemplate).repeat;

    return schema;
  }

  private applyFacetLayout(template: Template, schema: any): TopLevelSpec {
    const parentTemplate = template.parent as FacetTemplate;

    if (parentTemplate.isInlineFacetted) {
      if (schema.encoding === undefined) {
        schema.encoding = {};
      }

      schema.encoding.facet = parentTemplate.facet;
    } else {
      schema = this.abstractCompositions(schema, 'spec');
      schema.facet = parentTemplate.facet;
    }

    return schema;
  }

  private applyConcatLayout(schema: any): TopLevelSpec {
    return this.abstractCompositions(schema, 'hconcat');
  }

  private applyOverlayLayout(schema: any): TopLevelSpec {
    return this.abstractCompositions(schema, 'layer');
  }

  private applyCompositionLayout(template: Template, schema: any, composition: Composition): TopLevelSpec {
    if (composition === 'repeat') {
      this.applyRepeatLayout(template as RepeatTemplate, schema);
    } else if (composition === 'facet') {
      this.applyFacetLayout(template as FacetTemplate, schema);
    } else if (composition === 'concatenate') {
      this.applyConcatLayout(schema);
    } else if (composition === 'overlay') {
      this.applyOverlayLayout(schema);
    }

    return schema;
  }

  private getDataInHierarchy(template: Template): Data {
    // data can be stored either in a child node or on the top level template, therefore find the
    // top level, get its flat hierarchy and find a template with a dataset bound to it
    let topLevelTemplate: Template = template;
    let data: Data = null;

    while (topLevelTemplate.parent !== null) {
      if (topLevelTemplate.data !== undefined && topLevelTemplate.data !== null) {
        data = topLevelTemplate.data;

        return data;
      }

      topLevelTemplate = topLevelTemplate.parent;
    }

    const flatHierarchy = topLevelTemplate.getFlatHierarchy();
    const dataTemplate: Template = flatHierarchy.find(t => {
      return t.data !== null && t.data !== undefined;
    });

    // could occur when template has no parent, no visualelements and no data (i.e. is "empty")
    if (dataTemplate === undefined) {
      return {
        values: [],
      };
    }

    data = dataTemplate.data;

    return data;
  }

  private getDatasetsInAncestry(template: Template): Datasets {
    // if the template references a namedDataset, also include that dataset.
    if (template.data !== null && !isNamedData(template.data)) {
      return null;
    }

    let workingNode = template;

    while (workingNode !== null && (workingNode.datasets === null || workingNode.datasets === undefined)) {
      workingNode = workingNode.parent;
    }

    if (workingNode === null) {
      return null;
    }

    return workingNode.datasets;
  }

  private getRepeatSpec(parentTemplate: Template): TopLevelSpec {
    const template = parentTemplate.visualElements[0];
    const layout = parentTemplate.layout;
    let schema: any = null;

    schema = this.getVegaSpecification(template, false);

    if (schema !== null) {
      schema = this.applyCompositionLayout(template, schema, layout as Composition);
    }

    return schema;
  }

  private getFacetSpec(parentTemplate: FacetTemplate): TopLevelSpec {
    const encodingTemplate = parentTemplate.visualElements[0];
    let schema: any = null;

    // use the encodings from the child template, then apply facetting properties
    schema = this.getVegaSpecification(encodingTemplate, false);

    schema = this.applyCompositionLayout(encodingTemplate, schema, 'facet');

    return schema;
  }

  private getMultiViewSpec(template: CompositionTemplate, useOverwrittenEncodings: boolean): TopLevelSpec {
    const templates = template.visualElements;
    const schema: any = this.getBasicSchema();
    const overwriteChildEncodings = !(template instanceof RepeatTemplate) && useOverwrittenEncodings;

    const individualSchemas = templates
      .map(t => this.getVegaSpecification(t, false, overwriteChildEncodings));

    const individualViewAbstractions = individualSchemas
      .map(s => getAbstraction(s));

    if (template instanceof ConcatTemplate) {
      if (template.isVertical) {
        schema.vconcat = individualViewAbstractions;
      } else {
        schema.hconcat = individualViewAbstractions;
      }
    } else if (template instanceof LayerTemplate) {

      if (template.groupEncodings.size > 0) {
        schema.encoding = {};
        template.groupEncodings.forEach((value, key) => schema.encoding[key] = value);
        individualViewAbstractions.forEach(abstraction => {
          delete abstraction.data;
          delete abstraction.datasets;
        });
      }

      schema.layer = individualViewAbstractions;
    }

    return schema;
  }

  private getPlotSchema(template: PlotTemplate, inferData: boolean, useOverwrittenEncodings: boolean) {
    const schema = this.getBasicSchema();
    let data: Data = template.data;
    let datasets: Datasets = template.datasets;

    if (inferData) {
      data = this.getDataInHierarchy(template);
      datasets = this.getDatasetsInAncestry(template);
    }

    if (data !== undefined && data !== null) {
      schema.data = data;
    }
    if (datasets !== undefined && datasets !== null) {
      schema.datasets = datasets;
    }

    schema.mark = template.mark;

    if (template.selection !== undefined) {
      schema.selection = template.selection;
    }

    schema.encoding = {};

    template.encodings.forEach((value, key) => {
      schema.encoding[key] = value;
    });

    // do not overwrite encodings of repeated plots, as this would in turn use a mapping to a field
    // instead of the repeated column/row
    if (useOverwrittenEncodings) {
      template.overwrittenEncodings.forEach((value, key) => {
        schema.encoding[key] = value;
      });
    }

    return schema;
  }

  private getCompositionSchema(template: CompositionTemplate, inferData: boolean, useOverwrittenEncodings: boolean) {
    let schema: any = null;
    let data: Data = null;
    let datasets: Datasets = null;

    if (template.visualElements.length === 0) {
      schema = this.getBasicSchema(template);
    } else if (template instanceof RepeatTemplate) {
      schema = this.getRepeatSpec(template);
    } else if (template instanceof FacetTemplate) {
      schema = this.getFacetSpec(template);
    } else {
      schema = this.getMultiViewSpec(template, useOverwrittenEncodings);
    }

    if (inferData) {
      data = this.getDataInHierarchy(template);
      datasets = getAllDatasetsInHierarchy(template);
    } else {
      data = template.data;
      datasets = template.datasets;
    }

    if (data !== undefined && data !== null) {
      schema.data = data;
    }
    if (datasets !== undefined && datasets !== null) {
      schema.datasets = datasets;
    }

    if (template.resolve !== undefined) {
      schema.resolve = template.resolve;
    }

    return schema;
  }

  public getVegaSpecification(template: Template, inferProperties: boolean = false, useOverwrittenEncodings: boolean = false) {
    let schema: any = null;

    if (template instanceof PlotTemplate) {
      schema = this.getPlotSchema(template, inferProperties, useOverwrittenEncodings);
    } else if (template instanceof CompositionTemplate) {
      schema = this.getCompositionSchema(template, inferProperties, useOverwrittenEncodings);
    }

    schema = this.setToplevelProperties(schema, template);

    if (inferProperties) {
      const rootTemplate = this.getRootTemplate(template);
      schema = this.setToplevelProperties(schema, rootTemplate, false);
    }

    return schema;
  }
}