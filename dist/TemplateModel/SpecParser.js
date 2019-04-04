"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spec_1 = require("vega-lite/build/src/spec");
const channeldef_1 = require("vega-lite/build/src/channeldef");
const data_1 = require("vega-lite/build/src/data");
const concat_1 = require("vega-lite/build/src/spec/concat");
const InlineDatasetNode_1 = require("../DataModel/Datasets/InlineDatasetNode");
const NamedDataSourceNode_1 = require("../DataModel/Datasets/NamedDataSourceNode");
const URLDatasetNode_1 = require("../DataModel/Datasets/URLDatasetNode");
const TranformNode_1 = require("../DataModel/Transforms/TranformNode");
const CompositionTemplate_1 = require("./CompositionTemplate");
const ConcatTemplate_1 = require("./ConcatTemplate");
const FacetTemplate_1 = require("./FacetTemplate");
const LayerTemplate_1 = require("./LayerTemplate");
const PlotTemplate_1 = require("./PlotTemplate");
const RepeatTemplate_1 = require("./RepeatTemplate");
const SpecUtils_1 = require("./SpecUtils");
class SpecParser {
    getEncodingsMapFromPlotSchema(schema) {
        const templateEncodings = new Map();
        // a mark can also be configured using the "global" encoding of layered views, in this case the
        // mark's encoding can be empty
        if (schema.encoding === undefined) {
            return templateEncodings;
        }
        const schemaEncodings = Object.keys(schema.encoding);
        schemaEncodings.forEach((encoding) => {
            templateEncodings.set(encoding, schema.encoding[encoding]);
        });
        return templateEncodings;
    }
    setSingleViewProperties(schema, template) {
        template.description = schema.description;
        template.bounds = schema.bounds;
        template.width = schema.width;
        template.height = schema.height;
        template.config = schema.config;
        template.datasets = schema.datasets;
        if (template instanceof CompositionTemplate_1.CompositionTemplate) {
            template.spacing = schema.spacing;
            template.columns = schema.columns;
        }
    }
    getNonRepeatSubtrees(template) {
        const nonRepeatSubtrees = [];
        template.visualElements.forEach(t => {
            if (!(t instanceof RepeatTemplate_1.RepeatTemplate)) {
                nonRepeatSubtrees.push(t);
                nonRepeatSubtrees.push(...this.getNonRepeatSubtrees(t));
            }
        });
        return nonRepeatSubtrees;
    }
    /**
     * In a repeat spec, the bindings inside the child templates can reference the repeated fields
     * instead of fields from the data. In order to render such a template without its parent,
     * modify this binding to the first entries in the repeated fields of the parent
     */
    removeRepeatFromChildTemplates(template) {
        const nonRepeatSubTemplates = this.getNonRepeatSubtrees(template);
        nonRepeatSubTemplates.forEach(childTemplate => {
            const repeatedFields = template.repeat.column.concat(template.repeat.row);
            childTemplate.encodings.forEach((value, key) => {
                if (channeldef_1.isFieldDef(value)) {
                    if (channeldef_1.isRepeatRef(value.field)) {
                        const index = Math.floor(Math.random() * repeatedFields.length);
                        const fieldRef = {
                            field: repeatedFields[index],
                            type: value.type
                        };
                        childTemplate.overwrittenEncodings.set(key, fieldRef);
                    }
                }
            });
        });
    }
    getRepeatTemplate(schema) {
        const template = new RepeatTemplate_1.RepeatTemplate([]);
        template.repeat = schema.repeat;
        const childTemplate = this.parse(schema.spec);
        template.visualElements = [childTemplate];
        this.removeRepeatFromChildTemplates(template);
        return template;
    }
    getFacetTemplate(schema) {
        const template = new FacetTemplate_1.FacetTemplate([]);
        const visualElements = [];
        if (schema.facet !== undefined) {
            template.facet = JSON.parse(JSON.stringify(schema.facet));
            delete schema.facet;
            visualElements.push(this.parse(schema.spec));
        }
        else if (schema.encoding.facet !== undefined) {
            template.isInlineFacetted = true;
            template.facet = JSON.parse(JSON.stringify(schema.encoding.facet));
            delete schema.encoding.facet;
            visualElements.push(this.parse(schema));
        }
        template.visualElements = visualElements;
        return template;
    }
    getLayerTemplate(schema) {
        const template = new LayerTemplate_1.LayerTemplate([]);
        if (schema.encoding !== undefined) {
            const groupEncodings = Object.keys(schema.encoding);
            groupEncodings.forEach((encoding) => {
                template.groupEncodings.set(encoding, schema.encoding[encoding]);
            });
        }
        schema.layer.forEach((layer) => {
            template.visualElements.push(this.parse(layer));
        });
        return template;
    }
    getConcatTemplate(schema) {
        const template = new ConcatTemplate_1.ConcatTemplate([]);
        if (spec_1.isVConcatSpec(schema)) {
            template.isVertical = true;
            template.isWrappable = false;
            schema.vconcat.forEach((layer) => {
                template.visualElements.push(this.parse(layer));
            });
        }
        else if (spec_1.isHConcatSpec(schema)) {
            template.isVertical = false;
            template.isWrappable = false;
            schema.hconcat.forEach((layer) => {
                template.visualElements.push(this.parse(layer));
            });
        }
        else if (concat_1.isConcatSpec(schema)) {
            template.isVertical = false;
            template.isWrappable = true;
            schema.concat.forEach((layer) => {
                template.visualElements.push(this.parse(layer));
            });
        }
        return template;
    }
    getCompositionTemplate(schema) {
        let template = null;
        if (SpecUtils_1.isRepeatSchema(schema)) {
            template = this.getRepeatTemplate(schema);
        }
        else if (SpecUtils_1.isOverlaySchema(schema)) {
            template = this.getLayerTemplate(schema);
        }
        else if (SpecUtils_1.isFacetSchema(schema)) {
            template = this.getFacetTemplate(schema);
        }
        else if (SpecUtils_1.isConcatenateSchema(schema)) {
            template = this.getConcatTemplate(schema);
        }
        const encodings = this.getEncodingsMapFromPlotSchema(schema);
        template.encodings = encodings;
        template.resolve = schema.resolve;
        template.visualElements.forEach(t => t.parent = template);
        template.encodings.forEach((value, key) => {
            template.visualElements.forEach(t => {
                t.overwrittenEncodings.set(key, value);
            });
        });
        return template;
    }
    getPlotTemplate(schema) {
        const plotTemplate = new PlotTemplate_1.PlotTemplate(null);
        plotTemplate.mark = schema.mark;
        const encodings = this.getEncodingsMapFromPlotSchema(schema);
        const properties = SpecUtils_1.getMarkPropertiesAsMap(schema.mark);
        plotTemplate.encodings = encodings;
        plotTemplate.staticMarkProperties = properties;
        return plotTemplate;
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
        let template = null;
        if (SpecUtils_1.isCompositionSchema(schema)) {
            template = this.getCompositionTemplate(schema);
        }
        else if (SpecUtils_1.isPlotSchema(schema)) {
            template = this.getPlotTemplate(schema);
        }
        this.setSingleViewProperties(schema, template);
        const dataTransformation = this.parseDataTransformation(schema);
        template.dataTransformationNode = dataTransformation;
        const datasets = SpecUtils_1.getJoinedDatasetsOfChildNodes(template);
        if (template instanceof PlotTemplate_1.PlotTemplate) {
            template.selection = schema.selection;
        }
        return template;
    }
}
exports.SpecParser = SpecParser;
