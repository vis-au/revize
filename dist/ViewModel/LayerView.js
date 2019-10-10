"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CompositionView_1 = require("./CompositionView");
class LayerView extends CompositionView_1.CompositionView {
    constructor(visualElements, parent = null) {
        super('overlay', visualElements, parent);
        this.groupEncodings = new Map();
    }
}
exports.LayerView = LayerView;
