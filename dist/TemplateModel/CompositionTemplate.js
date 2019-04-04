"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Template_1 = require("./Template");
class CompositionTemplate extends Template_1.Template {
    constructor(composition, visualElements, parent = null) {
        super(visualElements, composition, parent);
    }
}
exports.CompositionTemplate = CompositionTemplate;
