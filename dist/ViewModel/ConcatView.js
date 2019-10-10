"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CompositionView_1 = require("./CompositionView");
class ConcatView extends CompositionView_1.CompositionView {
    constructor(visualElements, parent = null) {
        super('concatenate', visualElements, parent);
        this.isVertical = true;
        this.isWrappable = false;
    }
}
exports.ConcatView = ConcatView;
