import { Mark, MarkDef } from 'vega-lite/build/src/mark';
import { SelectionDef } from 'vega-lite/build/src/selection';
import { MarkEncoding } from './MarkEncoding';
import { Template } from './Template';
export declare class PlotTemplate extends Template {
    selection?: SelectionDef;
    staticMarkProperties?: Map<MarkEncoding, any>;
    mark: MarkDef | Mark;
    constructor(parent?: Template);
    type: Mark;
}
