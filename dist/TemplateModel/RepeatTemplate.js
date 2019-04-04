"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CompositionTemplate_1 = require("./CompositionTemplate");
class RepeatTemplate extends CompositionTemplate_1.CompositionTemplate {
    constructor(visualElements, parent = null) {
        super('repeat', visualElements, parent);
        this.repeat = {};
    }
}
exports.RepeatTemplate = RepeatTemplate;
