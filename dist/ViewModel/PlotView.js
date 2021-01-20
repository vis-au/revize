"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlotView = void 0;
const mark_1 = require("vega-lite/build/src/mark");
const View_1 = require("./View");
class PlotView extends View_1.View {
    constructor(parent = null) {
        super([], null, parent);
        this.mark = null;
    }
    get type() {
        if (mark_1.isPrimitiveMark(this.mark)) {
            return this.mark;
        }
        else if (mark_1.isMarkDef(this.mark)) {
            return this.mark.type;
        }
    }
    set type(type) {
        if (this.mark === null) {
            this.mark = type;
        }
        else {
            if (mark_1.isPrimitiveMark(this.mark)) {
                this.mark = type;
            }
            else if (mark_1.isMarkDef(this.mark)) {
                this.mark.type = type;
            }
        }
    }
}
exports.PlotView = PlotView;
