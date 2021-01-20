import { Mark, MarkDef } from 'vega-lite/build/src/mark';
import { SelectionDef } from 'vega-lite/build/src/selection';
import { MarkEncoding } from './MarkEncoding';
import { View } from './View';
export declare class PlotView extends View {
    selection?: SelectionDef;
    staticMarkProperties?: Map<MarkEncoding, any>;
    mark: MarkDef | Mark;
    constructor(parent?: View);
    get type(): Mark;
    set type(type: Mark);
}
