"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spec_1 = require("vega-lite/build/src/spec");
const concat_1 = require("vega-lite/build/src/spec/concat");
const MarkEncoding_1 = require("./MarkEncoding");
function isAtomicSchema(schema) {
    return spec_1.isUnitSpec(schema) && !isFacetSchema(schema);
}
exports.isAtomicSchema = isAtomicSchema;
;
function isOverlaySchema(schema) {
    return spec_1.isLayerSpec(schema);
}
exports.isOverlaySchema = isOverlaySchema;
;
function isRepeatSchema(schema) {
    return spec_1.isRepeatSpec(schema);
}
exports.isRepeatSchema = isRepeatSchema;
;
function isConcatenateSchema(schema) {
    return spec_1.isAnyConcatSpec(schema) || concat_1.isConcatSpec(schema);
}
exports.isConcatenateSchema = isConcatenateSchema;
;
function isInlineFacetSchema(schema) {
    return (schema.encoding !== undefined && schema.encoding.facet !== undefined);
}
exports.isInlineFacetSchema = isInlineFacetSchema;
function isFacetSchema(schema) {
    return spec_1.isFacetSpec(schema) || isInlineFacetSchema(schema);
}
exports.isFacetSchema = isFacetSchema;
;
function isCompositionSchema(schema) {
    return isOverlaySchema(schema)
        || isRepeatSchema(schema)
        || isConcatenateSchema(schema)
        || isFacetSchema(schema);
}
exports.isCompositionSchema = isCompositionSchema;
;
function isPlotSchema(schema) {
    return isAtomicSchema(schema);
}
exports.isPlotSchema = isPlotSchema;
;
function getCompositionType(schema) {
    if (isOverlaySchema(schema)) {
        return 'overlay';
    }
    else if (isRepeatSchema(schema)) {
        return 'repeat';
    }
    else if (isConcatenateSchema(schema)) {
        return 'concatenate';
    }
    else if (isFacetSchema(schema)) {
        return 'facet';
    }
    return null;
}
exports.getCompositionType = getCompositionType;
;
function getLayerAbstraction(schema) {
    const currentLayers = JSON.parse(JSON.stringify(schema.layer));
    let currentEncoding;
    if (schema.encoding !== undefined) {
        currentEncoding = JSON.parse(JSON.stringify(schema.encoding));
    }
    delete schema.layer;
    delete schema.encoding;
    const abstraction = {
        layer: currentLayers
    };
    if (currentEncoding !== undefined) {
        abstraction.encoding = currentEncoding;
    }
    return abstraction;
}
exports.getLayerAbstraction = getLayerAbstraction;
;
function getRepeatAbstraction(schema) {
    const currentSpec = JSON.parse(JSON.stringify(schema.spec));
    const currentRepeat = JSON.parse(JSON.stringify(schema.repeat));
    const abstraction = {
        spec: currentSpec,
        repeat: currentRepeat
    };
    delete schema.spec;
    delete schema.repeat;
    return abstraction;
}
exports.getRepeatAbstraction = getRepeatAbstraction;
;
function getFacetAbstraction(schema) {
    const currentSpec = JSON.parse(JSON.stringify(schema.spec));
    const currentFacet = JSON.parse(JSON.stringify(schema.facet));
    const abstraction = {
        spec: currentSpec,
        facet: currentFacet
    };
    delete schema.spec;
    delete schema.facet;
    return abstraction;
}
exports.getFacetAbstraction = getFacetAbstraction;
;
function getConcatAbstraction(schema) {
    let currentConcat = null;
    let concatProp = null;
    if (concat_1.isConcatSpec(schema)) {
        concatProp = 'concat';
    }
    else if (concat_1.isHConcatSpec(schema)) {
        concatProp = 'hconcat';
    }
    else if (concat_1.isVConcatSpec(schema)) {
        concatProp = 'vconcat';
    }
    currentConcat = JSON.parse(JSON.stringify(schema[concatProp]));
    delete schema[concatProp];
    const abstraction = {};
    abstraction[concatProp] = currentConcat;
    return abstraction;
}
exports.getConcatAbstraction = getConcatAbstraction;
;
function getMarkPropertiesAsMap(mark) {
    const properties = new Map();
    // since every mark encoding could potentially be statically set for a mark, just go through
    // all of them and find the ones that are configured
    MarkEncoding_1.markEncodings.forEach(encoding => {
        if (mark[encoding] !== undefined) {
            properties.set(encoding, JSON.parse(JSON.stringify(mark[encoding])));
        }
    });
    return properties;
}
exports.getMarkPropertiesAsMap = getMarkPropertiesAsMap;
;
function getAtomicAbstraction(schema) {
    const abstraction = {
        mark: JSON.parse(JSON.stringify(schema.mark)),
    };
    if (schema.encoding !== undefined) {
        abstraction.encoding = JSON.parse(JSON.stringify(schema.encoding));
    }
    if (schema.selection !== undefined) {
        abstraction.selection = JSON.parse(JSON.stringify(schema.selection));
    }
    const staticProperties = getMarkPropertiesAsMap(schema.mark);
    staticProperties.forEach((property, key) => {
        abstraction[key] = property;
        delete schema[key];
    });
    delete schema.mark;
    delete schema.encoding;
    delete schema.selection;
    if (isRepeatSchema(schema) && abstraction.encoding !== undefined) {
        if (abstraction.encoding.x !== undefined) {
            abstraction.encoding.x = {
                field: { repeat: 'column' },
                type: abstraction.encoding.x.type
            };
        }
        if (abstraction.encoding.y !== undefined) {
            abstraction.encoding.y = {
                field: { repeat: 'row' },
                type: abstraction.encoding.y.type
            };
        }
    }
    else if (isFacetSchema(schema)) {
        if (abstraction.encoding.facet !== undefined) {
            delete abstraction.encoding.facet;
        }
    }
    return abstraction;
}
exports.getAtomicAbstraction = getAtomicAbstraction;
;
function setSingleViewProperties(schema, abstraction) {
    if (schema.bounds !== undefined) {
        abstraction.bounds = JSON.parse(JSON.stringify(schema.bounds));
    }
    if (schema.spacing !== undefined) {
        abstraction.spacing = JSON.parse(JSON.stringify(schema.spacing));
    }
    if (schema.columns !== undefined) {
        abstraction.columns = JSON.parse(JSON.stringify(schema.columns));
    }
    if (schema.width !== undefined) {
        abstraction.width = JSON.parse(JSON.stringify(schema.width));
    }
    if (schema.height !== undefined) {
        abstraction.height = JSON.parse(JSON.stringify(schema.height));
    }
    if (schema.data !== undefined) {
        abstraction.data = JSON.parse(JSON.stringify(schema.data));
    }
    if (schema.datasets !== undefined) {
        abstraction.datasets = JSON.parse(JSON.stringify(schema.datasets));
    }
    if (schema.transform !== undefined) {
        abstraction.transform = JSON.parse(JSON.stringify(schema.transform));
    }
    if (schema.config !== undefined) {
        abstraction.config = JSON.parse(JSON.stringify(schema.config));
    }
    if (schema.resolve !== undefined) {
        abstraction.resolve = JSON.parse(JSON.stringify(schema.resolve));
    }
    return abstraction;
}
exports.setSingleViewProperties = setSingleViewProperties;
;
function getJoinedDatasetsOfChildNodes(template) {
    const joinedDatasets = {};
    const visualElements = template.getFlatHierarchy();
    const childDatasets = visualElements
        .map(d => d.datasets)
        .filter(d => d !== undefined && d !== null);
    childDatasets.forEach(datasets => {
        const datasetKeys = Object.keys(datasets);
        datasetKeys.forEach(datasetKey => {
            joinedDatasets[datasetKey] = datasets[datasetKey];
        });
    });
    return joinedDatasets;
}
exports.getJoinedDatasetsOfChildNodes = getJoinedDatasetsOfChildNodes;
;
function getAllDatasetsInHierarchy(template) {
    const allDatasetsInHierarchy = getJoinedDatasetsOfChildNodes(template);
    let rootTemplate = template;
    // only get datasets that are direct ancestors of the template, as siblings are not relevant
    while (rootTemplate.parent !== null) {
        rootTemplate = rootTemplate.parent;
        if (rootTemplate.datasets) {
            Object.keys(rootTemplate.datasets).forEach(key => {
                allDatasetsInHierarchy[key] = rootTemplate.datasets[key];
            });
        }
    }
    return allDatasetsInHierarchy;
}
exports.getAllDatasetsInHierarchy = getAllDatasetsInHierarchy;
function getAbstraction(schema) {
    let abstraction = null;
    if (isAtomicSchema(schema)) {
        // atomic can either be content of a plot or repeat, indicated by the compositionpropety being
        // set to 'spec'
        abstraction = getAtomicAbstraction(schema);
    }
    else if (isOverlaySchema(schema)) {
        abstraction = getLayerAbstraction(schema);
    }
    else if (isRepeatSchema(schema)) {
        abstraction = getRepeatAbstraction(schema);
    }
    else if (isConcatenateSchema(schema)) {
        abstraction = getConcatAbstraction(schema);
    }
    else if (isFacetSchema(schema)) {
        if (isInlineFacetSchema(schema)) {
            abstraction = getAtomicAbstraction(schema);
        }
        else {
            abstraction = getFacetAbstraction(schema);
        }
    }
    abstraction = setSingleViewProperties(schema, abstraction);
    return abstraction;
}
exports.getAbstraction = getAbstraction;
;
function setSchemaSize(schema, width, height) {
    if (isPlotSchema(schema)) {
        schema.width = width;
        schema.height = height;
    }
    else if (isConcatenateSchema(schema)) {
        schema.width = width;
        schema.height = height;
    }
    else if (isRepeatSchema(schema)) {
        schema.spec.width = width;
        schema.spec.height = height;
    }
    else if (isFacetSchema(schema)) {
        if (isInlineFacetSchema(schema)) {
            schema.width = width;
            schema.height = height;
        }
        else {
            schema.spec.width = width;
            schema.spec.height = height;
        }
    }
    return schema;
}
exports.setSchemaSize = setSchemaSize;
;
