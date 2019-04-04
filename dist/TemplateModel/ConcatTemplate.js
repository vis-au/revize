"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CompositionTemplate_1 = require("./CompositionTemplate");
class ConcatTemplate extends CompositionTemplate_1.CompositionTemplate {
    constructor(visualElements, parent = null) {
        super('concatenate', visualElements, parent);
        this.isVertical = true;
        this.isWrappable = false;
    }
}
exports.ConcatTemplate = ConcatTemplate;
