import { isHConcatSpec, isVConcatSpec } from 'vega-lite/build/src/spec';
import { isInlineData, isNamedData, isUrlData } from 'vega-lite/build/src/data';
import { isConcatSpec } from 'vega-lite/build/src/spec/concat';
import { Transform } from 'vega-lite/build/src/transform';
import { isFieldDef, isRepeatRef } from 'vega-lite/build/src/channeldef';

import { DatasetNode } from '../DataModel/Datasets/DatasetNode';
import { InlineDatasetNode } from '../DataModel/Datasets/InlineDatasetNode';
import { NamedDataSourceNode } from '../DataModel/Datasets/NamedDataSourceNode';
import { URLDatasetNode } from '../DataModel/Datasets/URLDatasetNode';
import { GraphNode } from '../DataModel/GraphNode';
import { TransformNode } from '../DataModel/Transforms/TranformNode';
import { CompositionView } from './CompositionView';
import { ConcatView } from './ConcatView';
import { FacetView } from './FacetView';
import { LayerView } from './LayerView';
import { MarkEncoding } from './MarkEncoding';
import { PlotView } from './PlotView';
import { RepeatView } from './RepeatView';
import { getJoinedDatasetsOfChildNodes, getMarkPropertiesAsMap, isCompositionSchema, isConcatenateSchema, isFacetSchema, isOverlaySchema, isPlotSchema, isRepeatSchema } from './SpecUtils';
import { View } from './View';
import { transformNames } from '../DataModel';

export class SpecParser {

  private getEncodingsMapFromPlotSchema(schema: any) {
    const viewEncodings = new Map<MarkEncoding, any>();

    // a mark can also be configured using the "global" encoding of layered views, in this case the
    // mark's encoding can be empty
    if (schema.encoding === undefined) {
      return viewEncodings;
    }

    const schemaEncodings = Object.keys(schema.encoding) as MarkEncoding[];

    schemaEncodings.forEach((encoding: MarkEncoding) => {
      viewEncodings.set(encoding, schema.encoding[encoding]);
    });

    return viewEncodings;
  }

  private setSingleViewProperties(schema: any, view: View) {
    view.description = schema.description;
    view.bounds = schema.bounds;
    view.width = schema.width;
    view.height = schema.height;
    view.config = schema.config;
    view.datasets = schema.datasets;
    view.projection = schema.projection;

    if (view instanceof CompositionView) {
      view.spacing = schema.spacing;
      view.columns = schema.columns;
    }
  }

  private getNonRepeatSubtrees(view: View) {
    const nonRepeatSubtrees: View[] = [];

    view.visualElements.forEach(t => {
      if (!(t instanceof RepeatView)) {
        nonRepeatSubtrees.push(t);
        nonRepeatSubtrees.push(...this.getNonRepeatSubtrees(t));
      }
    });

    return nonRepeatSubtrees;
  }

  /**
   * In a repeat spec, the bindings inside the child views can reference the repeated fields
   * instead of fields from the data. In order to render such a view without its parent,
   * modify this binding to the first entries in the repeated fields of the parent
   */
  private removeRepeatFromChildViews(view: RepeatView) {
    const nonRepeatSubViews = this.getNonRepeatSubtrees(view);

    nonRepeatSubViews.forEach(childView => {
      const repeatedFields = view.repeat.column.concat(view.repeat.row);

      childView.encodings.forEach((value: any, key: MarkEncoding) => {
        if (isFieldDef<any>(value)) {
          if (isRepeatRef(value.field)) {
            const index = Math.floor(Math.random() * repeatedFields.length);
            const fieldRef = {
              field: repeatedFields[index],
              type: (value as any).type
            };

            childView.overwrittenEncodings.set(key, fieldRef)
          }
        }
      });
    });
  }

  private getRepeatView(schema: any) {
    const view = new RepeatView([]);
    view.repeat = schema.repeat;
    const childView = this.parse(schema.spec);
    view.visualElements = [childView];
    this.removeRepeatFromChildViews(view);

    return view;
  }

  private getFacetView(schema: any) {
    const view = new FacetView([]);
    const visualElements: View[] = [];

    if (schema.facet !== undefined) {
      view.facet = JSON.parse(JSON.stringify(schema.facet));
      delete schema.facet;
      visualElements.push(this.parse(schema.spec));
    } else if (schema.encoding.facet !== undefined) {
      view.isInlineFacetted = true;
      view.facet = JSON.parse(JSON.stringify(schema.encoding.facet));
      delete schema.encoding.facet;
      visualElements.push(this.parse(schema));
    }

    view.visualElements = visualElements;

    return view;
  }

  private getLayerView(schema: any) {
    const view = new LayerView([]);

    if (schema.encoding !== undefined) {
      const groupEncodings = Object.keys(schema.encoding);
      groupEncodings.forEach((encoding: MarkEncoding) => {
        (view as LayerView).groupEncodings.set(encoding, schema.encoding[encoding]);
      });
    }

    schema.layer.forEach((layer: any) => {
      view.visualElements.push(this.parse(layer));
    });

    return view;
  }

  private getConcatView(schema: any) {
    const view = new ConcatView([]);

    if (isVConcatSpec(schema)) {
      view.isVertical = true;
      view.isWrappable = false;
      schema.vconcat.forEach((layer: any) => {
        view.visualElements.push(this.parse(layer));
      });
    } else if (isHConcatSpec(schema)) {
      view.isVertical = false;
      view.isWrappable = false;
      schema.hconcat.forEach((layer: any) => {
        view.visualElements.push(this.parse(layer));
      });
    } else if (isConcatSpec(schema)) {
      view.isVertical = false;
      view.isWrappable = true;
      schema.concat.forEach((layer: any) => {
        view.visualElements.push(this.parse(layer));
      });
    }

    return view;
  }

  private getCompositionView(schema: any) {
    let view: CompositionView = null;

    if (isRepeatSchema(schema)) {
      view = this.getRepeatView(schema);
    } else if (isOverlaySchema(schema)) {
      view = this.getLayerView(schema);
    } else if (isFacetSchema(schema)) {
      view = this.getFacetView(schema);
    } else if (isConcatenateSchema(schema)) {
      view = this.getConcatView(schema);
    }

    const encodings = this.getEncodingsMapFromPlotSchema(schema);
    view.encodings = encodings;

    view.resolve = schema.resolve;
    view.visualElements.forEach(t => t.parent = view);

    view.encodings.forEach((value, key) => {
      view.visualElements.forEach(t => {
        t.overwrittenEncodings.set(key, value);
      });
    })

    return view;
  }

  private getPlotView(schema: any) {
    const plotView = new PlotView(null);
    plotView.mark = schema.mark;

    const encodings = this.getEncodingsMapFromPlotSchema(schema);
    const properties = getMarkPropertiesAsMap(schema.mark);

    plotView.encodings = encodings;
    plotView.staticMarkProperties = properties;

    return plotView;
  }

  private getRootDatasetNode(schema: any): DatasetNode {
    const data = schema.data;

    if (data === undefined) {
      return null;
    }

    let rootNode: DatasetNode = null;

    if (isUrlData(data)) {
      rootNode = new URLDatasetNode();
    } else if (isNamedData(data)) {
      rootNode = new NamedDataSourceNode();
    } else if (isInlineData(data)) {
      rootNode = new InlineDatasetNode();
    }

    rootNode.setSchema(data);

    return rootNode;
  }

  private getLeafTransformNode(schema: any, rootNode: DatasetNode): GraphNode {
    const transforms: Transform[] = schema.transform;
    let workingNode: GraphNode = rootNode;

    if (transforms === undefined) {
      return rootNode;
    }

    // create linear transformation list from the spec by creating a new transformation node for
    // each entry in the spec and linking it to the existin graph
    if (transforms !== undefined) {
      transforms.forEach(t => {
        const transformNode = new TransformNode();
        transformNode.transform = t;

        transformNames.forEach(transformName => {
          if (transformName in t) {
            transformNode.type = transformName;
          }
        });

        transformNode.parent = workingNode;
        workingNode.children.push(transformNode);

        workingNode = transformNode;
      });
    }

    return workingNode;
  }

  private parseDataTransformation(schema: any): GraphNode {
    const rootDataset = this.getRootDatasetNode(schema);

    if (rootDataset === null) {
      return rootDataset;
    } else {
      return this.getLeafTransformNode(schema, rootDataset);
    }
  }

  public parse(schema: any) {
    let view: View = null;

    if (isCompositionSchema(schema)) {
      view = this.getCompositionView(schema);
    } else if (isPlotSchema(schema)) {
      view = this.getPlotView(schema);
    }

    this.setSingleViewProperties(schema, view);

    const dataTransformation = this.parseDataTransformation(schema);
    view.dataTransformationNode = dataTransformation;

    const datasets = getJoinedDatasetsOfChildNodes(view);

    if (view instanceof PlotView) {
      view.selection = schema.selection;
    }

    return view;
  }
}