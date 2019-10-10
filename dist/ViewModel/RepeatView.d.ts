import { RepeatMapping } from 'vega-lite/build/src/spec/repeat';
import { CompositionView } from './CompositionView';
import { View } from './View';
export declare class RepeatView extends CompositionView {
    repeat: RepeatMapping;
    constructor(visualElements: View[], parent?: View);
}
