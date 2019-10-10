"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const View_1 = require("./View");
class CompositionView extends View_1.View {
    constructor(composition, visualElements, parent = null) {
        super(visualElements, composition, parent);
    }
}
exports.CompositionView = CompositionView;
