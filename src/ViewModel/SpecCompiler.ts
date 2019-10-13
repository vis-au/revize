import { TopLevelSpec } from 'vega-lite';

import { Data, isNamedData } from 'vega-lite/build/src/data';
import { Datasets } from 'vega-lite/build/src/spec/toplevel';
import { CompositionView } from './CompositionView';
import { ConcatView } from './ConcatView';
import { FacetView } from './FacetView';
import { LayerView } from './LayerView';
import { Composition } from './LayoutType';
import { PlotView } from './PlotView';
import { RepeatView } from './RepeatView';
import { getAbstraction, getAllDatasetsInHierarchy } from './SpecUtils';
import { View } from './View';
import { TransformNode, DatasetNode } from '../DataModel';


export class SpecCompiler {
  public getBasicSchema(view?: View): any {
    // check for empty views, which should also generate valid specs
    if (view && view.visualElements.length === 0 && view.parent === null) {
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

  private setCompositionProperties(schema: any, view: CompositionView) {
    if (view.columns !== undefined) {
      schema.columns = view.columns;
    }
    if (view.spacing !== undefined) {
      schema.spacing = view.spacing;
    }

    return schema;
  }

  private setToplevelProperties(schema: any, view: View, includeData: boolean = true) {
    if (includeData && !!view.data) {
      schema.data = view.data;

      const dataNode = view.dataTransformationNode;

      if (dataNode instanceof TransformNode) {
        schema.transform = dataNode.getTransform();
      } else if (dataNode instanceof DatasetNode) {
        schema.transform = dataNode.getAllChildNodes().map(node => node.transform);
      }
    }
    if (includeData && !!view.datasets) {
      schema.datasets = view.datasets;
    }
    if (view.bounds !== undefined) {
      schema.bounds = view.bounds;
    }
    if (view.height !== undefined) {
      schema.height = view.height;
    }
    if (view.width !== undefined) {
      schema.width = view.width;
    }
    if (view.config !== undefined) {
      schema.config = view.config;
    }
    if (view.projection !== undefined) {
      schema.projection = view.projection;
    }

    if (view instanceof CompositionView) {
      schema = this.setCompositionProperties(schema, view);
    }

    return schema;
  }

  private getRootView(view: View) {
    let workingNode = view;

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

  private applyRepeatLayout(view: RepeatView, schema: any): TopLevelSpec {
    schema = this.abstractCompositions(schema, 'spec');

    // parent must be repeat view to reach this branch
    schema.repeat = (view.parent as RepeatView).repeat;

    return schema;
  }

  private applyFacetLayout(view: View, schema: any): TopLevelSpec {
    const parentView = view.parent as FacetView;

    if (parentView.isInlineFacetted) {
      if (schema.encoding === undefined) {
        schema.encoding = {};
      }

      schema.encoding.facet = parentView.facet;
    } else {
      schema = this.abstractCompositions(schema, 'spec');
      schema.facet = parentView.facet;
    }

    return schema;
  }

  private applyConcatLayout(schema: any): TopLevelSpec {
    return this.abstractCompositions(schema, 'hconcat');
  }

  private applyOverlayLayout(schema: any): TopLevelSpec {
    return this.abstractCompositions(schema, 'layer');
  }

  private applyCompositionLayout(view: View, schema: any, composition: Composition): TopLevelSpec {
    if (composition === 'repeat') {
      this.applyRepeatLayout(view as RepeatView, schema);
    } else if (composition === 'facet') {
      this.applyFacetLayout(view as FacetView, schema);
    } else if (composition === 'concatenate') {
      this.applyConcatLayout(schema);
    } else if (composition === 'overlay') {
      this.applyOverlayLayout(schema);
    }

    return schema;
  }

  private getDataInHierarchy(view: View): Data {
    // data can be stored either in a child node or on the top level view, therefore find the
    // top level, get its flat hierarchy and find a view with a dataset bound to it
    let topLevelView: View = view;
    let data: Data = null;

    while (topLevelView.parent !== null) {
      if (topLevelView.data !== undefined && topLevelView.data !== null) {
        data = topLevelView.data;

        return data;
      }

      topLevelView = topLevelView.parent;
    }

    const flatHierarchy = topLevelView.getFlatHierarchy();
    const dataView: View = flatHierarchy.find(t => {
      return t.data !== null && t.data !== undefined;
    });

    // could occur when view has no parent, no visualelements and no data (i.e. is "empty")
    if (dataView === undefined) {
      return {
        values: [],
      };
    }

    data = dataView.data;

    return data;
  }

  private getDatasetsInAncestry(view: View): Datasets {
    // if the view references a namedDataset, also include that dataset.
    if (view.data !== null && !isNamedData(view.data)) {
      return null;
    }

    let workingNode = view;

    while (workingNode !== null && (workingNode.datasets === null || workingNode.datasets === undefined)) {
      workingNode = workingNode.parent;
    }

    if (workingNode === null) {
      return null;
    }

    return workingNode.datasets;
  }

  private getRepeatSpec(parentView: View): TopLevelSpec {
    const view = parentView.visualElements[0];
    const layout = parentView.layout;
    let schema: any = null;

    schema = this.getVegaSpecification(view, false);

    if (schema !== null) {
      schema = this.applyCompositionLayout(view, schema, layout as Composition);
    }

    return schema;
  }

  private getFacetSpec(parentView: FacetView): TopLevelSpec {
    const encodingView = parentView.visualElements[0];
    let schema: any = null;

    // use the encodings from the child view, then apply facetting properties
    schema = this.getVegaSpecification(encodingView, false);

    schema = this.applyCompositionLayout(encodingView, schema, 'facet');

    return schema;
  }

  private getMultiViewSpec(view: CompositionView, useOverwrittenEncodings: boolean): TopLevelSpec {
    const views = view.visualElements;
    const schema: any = this.getBasicSchema();
    const overwriteChildEncodings = !(view instanceof RepeatView) && useOverwrittenEncodings;

    const individualSchemas = views
      .map(t => this.getVegaSpecification(t, false, overwriteChildEncodings));

    const individualViewAbstractions = individualSchemas
      .map(s => getAbstraction(s));

    if (view instanceof ConcatView) {
      if (view.isVertical) {
        schema.vconcat = individualViewAbstractions;
      } else {
        schema.hconcat = individualViewAbstractions;
      }
    } else if (view instanceof LayerView) {

      if (view.groupEncodings.size > 0) {
        schema.encoding = {};
        view.groupEncodings.forEach((value, key) => schema.encoding[key] = value);
        individualViewAbstractions.forEach(abstraction => {
          delete abstraction.data;
          delete abstraction.datasets;
        });
      }

      schema.layer = individualViewAbstractions;
    }

    return schema;
  }

  private getPlotSchema(view: PlotView, inferData: boolean, useOverwrittenEncodings: boolean) {
    const schema = this.getBasicSchema();
    let data: Data = view.data;
    let datasets: Datasets = view.datasets;

    if (inferData) {
      data = this.getDataInHierarchy(view);
      datasets = this.getDatasetsInAncestry(view);
    }

    if (data !== undefined && data !== null) {
      schema.data = data;
    }
    if (datasets !== undefined && datasets !== null) {
      schema.datasets = datasets;
    }

    schema.mark = view.mark;

    if (view.selection !== undefined) {
      schema.selection = view.selection;
    }

    schema.encoding = {};

    view.encodings.forEach((value, key) => {
      schema.encoding[key] = value;
    });

    // do not overwrite encodings of repeated plots, as this would in turn use a mapping to a field
    // instead of the repeated column/row
    if (useOverwrittenEncodings) {
      view.overwrittenEncodings.forEach((value, key) => {
        schema.encoding[key] = value;
      });
    }

    return schema;
  }

  private getCompositionSchema(view: CompositionView, inferData: boolean, useOverwrittenEncodings: boolean) {
    let schema: any = null;
    let data: Data = null;
    let datasets: Datasets = null;

    if (view.visualElements.length === 0) {
      schema = this.getBasicSchema(view);
    } else if (view instanceof RepeatView) {
      schema = this.getRepeatSpec(view);
    } else if (view instanceof FacetView) {
      schema = this.getFacetSpec(view);
    } else {
      schema = this.getMultiViewSpec(view, useOverwrittenEncodings);
    }

    if (inferData) {
      data = this.getDataInHierarchy(view);
      datasets = getAllDatasetsInHierarchy(view);
    } else {
      data = view.data;
      datasets = view.datasets;
    }

    if (data !== undefined && data !== null) {
      schema.data = data;
    }
    if (datasets !== undefined && datasets !== null) {
      schema.datasets = datasets;
    }

    if (view.resolve !== undefined) {
      schema.resolve = view.resolve;
    }

    return schema;
  }

  public getVegaSpecification(view: View, inferProperties: boolean = false, useOverwrittenEncodings: boolean = false) {
    let schema: any = null;

    if (view instanceof PlotView) {
      schema = this.getPlotSchema(view, inferProperties, useOverwrittenEncodings);
    } else if (view instanceof CompositionView) {
      schema = this.getCompositionSchema(view, inferProperties, useOverwrittenEncodings);
    }

    schema = this.setToplevelProperties(schema, view);

    if (inferProperties) {
      const rootView = this.getRootView(view);
      schema = this.setToplevelProperties(schema, rootView, false);
    }

    return schema;
  }
}