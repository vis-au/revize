"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecParser = void 0;
const spec_1 = require("vega-lite/build/src/spec");
const data_1 = require("vega-lite/build/src/data");
const concat_1 = require("vega-lite/build/src/spec/concat");
const channeldef_1 = require("vega-lite/build/src/channeldef");
const InlineDatasetNode_1 = require("../DataModel/Datasets/InlineDatasetNode");
const NamedDataSourceNode_1 = require("../DataModel/Datasets/NamedDataSourceNode");
const URLDatasetNode_1 = require("../DataModel/Datasets/URLDatasetNode");
const TranformNode_1 = require("../DataModel/Transforms/TranformNode");
const CompositionView_1 = require("./CompositionView");
const ConcatView_1 = require("./ConcatView");
const FacetView_1 = require("./FacetView");
const LayerView_1 = require("./LayerView");
const PlotView_1 = require("./PlotView");
const RepeatView_1 = require("./RepeatView");
const SpecUtils_1 = require("./SpecUtils");
const DataModel_1 = require("../DataModel");
class SpecParser {
    getEncodingsMapFromPlotSchema(schema) {
        const viewEncodings = new Map();
        // a mark can also be configured using the "global" encoding of layered views, in this case the
        // mark's encoding can be empty
        if (schema.encoding === undefined) {
            return viewEncodings;
        }
        const schemaEncodings = Object.keys(schema.encoding);
        schemaEncodings.forEach((encoding) => {
            viewEncodings.set(encoding, schema.encoding[encoding]);
        });
        return viewEncodings;
    }
    setSingleViewProperties(schema, view) {
        view.description = schema.description;
        view.bounds = schema.bounds;
        view.width = schema.width;
        view.height = schema.height;
        view.config = schema.config;
        view.datasets = schema.datasets;
        view.projection = schema.projection;
        if (view instanceof CompositionView_1.CompositionView) {
            view.spacing = schema.spacing;
            view.columns = schema.columns;
        }
    }
    getNonRepeatSubtrees(view) {
        const nonRepeatSubtrees = [];
        view.visualElements.forEach(t => {
            if (!(t instanceof RepeatView_1.RepeatView)) {
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
    removeRepeatFromChildViews(view) {
        const nonRepeatSubViews = this.getNonRepeatSubtrees(view);
        nonRepeatSubViews.forEach(childView => {
            const repeatedFields = view.repeat.column.concat(view.repeat.row);
            childView.encodings.forEach((value, key) => {
                if (channeldef_1.isFieldDef(value)) {
                    if (channeldef_1.isRepeatRef(value.field)) {
                        const index = Math.floor(Math.random() * repeatedFields.length);
                        const fieldRef = {
                            field: repeatedFields[index],
                            type: value.type
                        };
                        childView.overwrittenEncodings.set(key, fieldRef);
                    }
                }
            });
        });
    }
    getRepeatView(schema) {
        const view = new RepeatView_1.RepeatView([]);
        view.repeat = schema.repeat;
        const childView = this.parse(schema.spec);
        view.visualElements = [childView];
        this.removeRepeatFromChildViews(view);
        return view;
    }
    getFacetView(schema) {
        const view = new FacetView_1.FacetView([]);
        const visualElements = [];
        if (schema.facet !== undefined) {
            view.facet = JSON.parse(JSON.stringify(schema.facet));
            delete schema.facet;
            visualElements.push(this.parse(schema.spec));
        }
        else if (schema.encoding.facet !== undefined) {
            view.isInlineFacetted = true;
            view.facet = JSON.parse(JSON.stringify(schema.encoding.facet));
            delete schema.encoding.facet;
            visualElements.push(this.parse(schema));
        }
        view.visualElements = visualElements;
        return view;
    }
    getLayerView(schema) {
        const view = new LayerView_1.LayerView([]);
        if (schema.encoding !== undefined) {
            const groupEncodings = Object.keys(schema.encoding);
            groupEncodings.forEach((encoding) => {
                view.groupEncodings.set(encoding, schema.encoding[encoding]);
            });
        }
        schema.layer.forEach((layer) => {
            view.visualElements.push(this.parse(layer));
        });
        return view;
    }
    getConcatView(schema) {
        const view = new ConcatView_1.ConcatView([]);
        if (spec_1.isVConcatSpec(schema)) {
            view.isVertical = true;
            view.isWrappable = false;
            schema.vconcat.forEach((layer) => {
                view.visualElements.push(this.parse(layer));
            });
        }
        else if (spec_1.isHConcatSpec(schema)) {
            view.isVertical = false;
            view.isWrappable = false;
            schema.hconcat.forEach((layer) => {
                view.visualElements.push(this.parse(layer));
            });
        }
        else if (concat_1.isConcatSpec(schema)) {
            view.isVertical = false;
            view.isWrappable = true;
            schema.concat.forEach((layer) => {
                view.visualElements.push(this.parse(layer));
            });
        }
        return view;
    }
    getCompositionView(schema) {
        let view = null;
        if (SpecUtils_1.isRepeatSchema(schema)) {
            view = this.getRepeatView(schema);
        }
        else if (SpecUtils_1.isOverlaySchema(schema)) {
            view = this.getLayerView(schema);
        }
        else if (SpecUtils_1.isFacetSchema(schema)) {
            view = this.getFacetView(schema);
        }
        else if (SpecUtils_1.isConcatenateSchema(schema)) {
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
        });
        return view;
    }
    getPlotView(schema) {
        const plotView = new PlotView_1.PlotView(null);
        plotView.mark = schema.mark;
        const encodings = this.getEncodingsMapFromPlotSchema(schema);
        const properties = SpecUtils_1.getMarkPropertiesAsMap(schema.mark);
        plotView.encodings = encodings;
        plotView.staticMarkProperties = properties;
        return plotView;
    }
    getRootDatasetNode(schema) {
        const data = schema.data;
        if (data === undefined) {
            return null;
        }
        let rootNode = null;
        if (data_1.isUrlData(data)) {
            rootNode = new URLDatasetNode_1.URLDatasetNode();
        }
        else if (data_1.isNamedData(data)) {
            rootNode = new NamedDataSourceNode_1.NamedDataSourceNode();
        }
        else if (data_1.isInlineData(data)) {
            rootNode = new InlineDatasetNode_1.InlineDatasetNode();
        }
        rootNode.setSchema(data);
        return rootNode;
    }
    getLeafTransformNode(schema, rootNode) {
        const transforms = schema.transform;
        let workingNode = rootNode;
        if (transforms === undefined) {
            return rootNode;
        }
        // create linear transformation list from the spec by creating a new transformation node for
        // each entry in the spec and linking it to the existin graph
        if (transforms !== undefined) {
            transforms.forEach(t => {
                const transformNode = new TranformNode_1.TransformNode();
                transformNode.transform = t;
                DataModel_1.transformNames.forEach(transformName => {
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
    parseDataTransformation(schema) {
        const rootDataset = this.getRootDatasetNode(schema);
        if (rootDataset === null) {
            return rootDataset;
        }
        else {
            return this.getLeafTransformNode(schema, rootDataset);
        }
    }
    parse(schema) {
        let view = null;
        if (SpecUtils_1.isCompositionSchema(schema)) {
            view = this.getCompositionView(schema);
        }
        else if (SpecUtils_1.isPlotSchema(schema)) {
            view = this.getPlotView(schema);
        }
        this.setSingleViewProperties(schema, view);
        const dataTransformation = this.parseDataTransformation(schema);
        view.dataTransformationNode = dataTransformation;
        const datasets = SpecUtils_1.getJoinedDatasetsOfChildNodes(view);
        if (view instanceof PlotView_1.PlotView) {
            view.selection = schema.selection;
        }
        return view;
    }
}
exports.SpecParser = SpecParser;
