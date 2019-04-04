"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CompositionTemplate_1 = require("./CompositionTemplate");
class LayerTemplate extends CompositionTemplate_1.CompositionTemplate {
    constructor(visualElements, parent = null) {
        super('overlay', visualElements, parent);
        this.groupEncodings = new Map();
    }
}
exports.LayerTemplate = LayerTemplate;
