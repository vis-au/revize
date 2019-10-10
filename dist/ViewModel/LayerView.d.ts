import { CompositionView } from './CompositionView';
import { MarkEncoding } from './MarkEncoding';
import { View } from './View';
export declare class LayerView extends CompositionView {
    groupEncodings: Map<MarkEncoding, any>;
    constructor(visualElements: View[], parent?: View);
}
