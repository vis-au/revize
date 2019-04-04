import { CompositionTemplate } from './CompositionTemplate';
import { Template } from './Template';
export declare class ConcatTemplate extends CompositionTemplate {
    isVertical: boolean;
    isWrappable: boolean;
    constructor(visualElements: Template[], parent?: Template);
}
