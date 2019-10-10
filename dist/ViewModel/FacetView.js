"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CompositionView_1 = require("./CompositionView");
class FacetView extends CompositionView_1.CompositionView {
    constructor(visualElements, parent = null) {
        super('facet', visualElements, parent);
        this.isInlineFacetted = false;
    }
}
exports.FacetView = FacetView;
