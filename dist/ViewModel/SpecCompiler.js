"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("vega-lite/build/src/data");
const CompositionView_1 = require("./CompositionView");
const ConcatView_1 = require("./ConcatView");
const FacetView_1 = require("./FacetView");
const LayerView_1 = require("./LayerView");
const PlotView_1 = require("./PlotView");
const RepeatView_1 = require("./RepeatView");
const SpecUtils_1 = require("./SpecUtils");
const DataModel_1 = require("../DataModel");
class SpecCompiler {
    getBasicSchema(view) {
        // check for empty views, which should also generate valid specs
        if (view && view.visualElements.length === 0 && view.parent === null) {
            return {
                $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
                mark: 'area',
                encoding: {}
            };
        }
        return {
            $schema: 'https://vega.github.io/schema/vega-lite/v3.json'
        };
    }
    setCompositionProperties(schema, view) {
        if (view.columns !== undefined) {
            schema.columns = view.columns;
        }
        if (view.spacing !== undefined) {
            schema.spacing = view.spacing;
        }
        return schema;
    }
    setToplevelProperties(schema, view, includeData = true) {
        if (includeData && !!view.data) {
            schema.data = view.data;
            const dataNode = view.dataTransformationNode;
            if (dataNode instanceof DataModel_1.TransformNode) {
                schema.transform = dataNode.getTransform();
            }
            else if (dataNode instanceof DataModel_1.DatasetNode) {
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
        if (view instanceof CompositionView_1.CompositionView) {
            schema = this.setCompositionProperties(schema, view);
        }
        return schema;
    }
    getRootView(view) {
        let workingNode = view;
        while (workingNode.parent !== null) {
            workingNode = workingNode.parent;
        }
        return workingNode;
    }
    abstractCompositions(schema, compositionProperty) {
        const abstraction = SpecUtils_1.getAbstraction(schema);
        if (compositionProperty === 'spec' || compositionProperty === 'facet') {
            schema[compositionProperty] = abstraction;
        }
        else {
            schema[compositionProperty] = [abstraction];
        }
        return schema;
    }
    applyRepeatLayout(view, schema) {
        schema = this.abstractCompositions(schema, 'spec');
        // parent must be repeat view to reach this branch
        schema.repeat = view.parent.repeat;
        return schema;
    }
    applyFacetLayout(view, schema) {
        const parentView = view.parent;
        if (parentView.isInlineFacetted) {
            if (schema.encoding === undefined) {
                schema.encoding = {};
            }
            schema.encoding.facet = parentView.facet;
        }
        else {
            schema = this.abstractCompositions(schema, 'spec');
            schema.facet = parentView.facet;
        }
        return schema;
    }
    applyConcatLayout(schema) {
        return this.abstractCompositions(schema, 'hconcat');
    }
    applyOverlayLayout(schema) {
        return this.abstractCompositions(schema, 'layer');
    }
    applyCompositionLayout(view, schema, composition) {
        if (composition === 'repeat') {
            this.applyRepeatLayout(view, schema);
        }
        else if (composition === 'facet') {
            this.applyFacetLayout(view, schema);
        }
        else if (composition === 'concatenate') {
            this.applyConcatLayout(schema);
        }
        else if (composition === 'overlay') {
            this.applyOverlayLayout(schema);
        }
        return schema;
    }
    getDataInHierarchy(view) {
        // data can be stored either in a child node or on the top level view, therefore find the
        // top level, get its flat hierarchy and find a view with a dataset bound to it
        let topLevelView = view;
        let data = null;
        while (topLevelView.parent !== null) {
            if (topLevelView.data !== undefined && topLevelView.data !== null) {
                data = topLevelView.data;
                return data;
            }
            topLevelView = topLevelView.parent;
        }
        const flatHierarchy = topLevelView.getFlatHierarchy();
        const dataView = flatHierarchy.find(t => {
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
    getDatasetsInAncestry(view) {
        // if the view references a namedDataset, also include that dataset.
        if (view.data !== null && !data_1.isNamedData(view.data)) {
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
    getRepeatSpec(parentView) {
        const view = parentView.visualElements[0];
        const layout = parentView.layout;
        let schema = null;
        schema = this.getVegaSpecification(view, false);
        if (schema !== null) {
            schema = this.applyCompositionLayout(view, schema, layout);
        }
        return schema;
    }
    getFacetSpec(parentView) {
        const encodingView = parentView.visualElements[0];
        let schema = null;
        // use the encodings from the child view, then apply facetting properties
        schema = this.getVegaSpecification(encodingView, false);
        schema = this.applyCompositionLayout(encodingView, schema, 'facet');
        return schema;
    }
    getMultiViewSpec(view, useOverwrittenEncodings) {
        const views = view.visualElements;
        const schema = this.getBasicSchema();
        const overwriteChildEncodings = !(view instanceof RepeatView_1.RepeatView) && useOverwrittenEncodings;
        const individualSchemas = views
            .map(t => this.getVegaSpecification(t, false, overwriteChildEncodings));
        const individualViewAbstractions = individualSchemas
            .map(s => SpecUtils_1.getAbstraction(s));
        if (view instanceof ConcatView_1.ConcatView) {
            if (view.isVertical) {
                schema.vconcat = individualViewAbstractions;
            }
            else {
                schema.hconcat = individualViewAbstractions;
            }
        }
        else if (view instanceof LayerView_1.LayerView) {
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
    getPlotSchema(view, inferData, useOverwrittenEncodings) {
        const schema = this.getBasicSchema();
        let data = view.data;
        let datasets = view.datasets;
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
    getCompositionSchema(view, inferData, useOverwrittenEncodings) {
        let schema = null;
        let data = null;
        let datasets = null;
        if (view.visualElements.length === 0) {
            schema = this.getBasicSchema(view);
        }
        else if (view instanceof RepeatView_1.RepeatView) {
            schema = this.getRepeatSpec(view);
        }
        else if (view instanceof FacetView_1.FacetView) {
            schema = this.getFacetSpec(view);
        }
        else {
            schema = this.getMultiViewSpec(view, useOverwrittenEncodings);
        }
        if (inferData) {
            data = this.getDataInHierarchy(view);
            datasets = SpecUtils_1.getAllDatasetsInHierarchy(view);
        }
        else {
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
    getVegaSpecification(view, inferProperties = false, useOverwrittenEncodings = false) {
        let schema = null;
        if (view instanceof PlotView_1.PlotView) {
            schema = this.getPlotSchema(view, inferProperties, useOverwrittenEncodings);
        }
        else if (view instanceof CompositionView_1.CompositionView) {
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
exports.SpecCompiler = SpecCompiler;
