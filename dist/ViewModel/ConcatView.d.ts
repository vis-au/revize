import { CompositionView } from './CompositionView';
import { View } from './View';
export declare class ConcatView extends CompositionView {
    isVertical: boolean;
    isWrappable: boolean;
    constructor(visualElements: View[], parent?: View);
}
