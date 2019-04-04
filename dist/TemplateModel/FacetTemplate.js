"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CompositionTemplate_1 = require("./CompositionTemplate");
class FacetTemplate extends CompositionTemplate_1.CompositionTemplate {
    constructor(visualElements, parent = null) {
        super('facet', visualElements, parent);
        this.isInlineFacetted = false;
    }
}
exports.FacetTemplate = FacetTemplate;
