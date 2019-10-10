"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CompositionView_1 = require("./CompositionView");
class RepeatView extends CompositionView_1.CompositionView {
    constructor(visualElements, parent = null) {
        super('repeat', visualElements, parent);
        this.repeat = {};
    }
}
exports.RepeatView = RepeatView;
