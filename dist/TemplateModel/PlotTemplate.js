"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mark_1 = require("vega-lite/build/src/mark");
const Template_1 = require("./Template");
class PlotTemplate extends Template_1.Template {
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
exports.PlotTemplate = PlotTemplate;
