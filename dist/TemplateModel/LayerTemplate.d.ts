import { CompositionTemplate } from './CompositionTemplate';
import { MarkEncoding } from './MarkEncoding';
import { Template } from './Template';
export declare class LayerTemplate extends CompositionTemplate {
    groupEncodings: Map<MarkEncoding, any>;
    constructor(visualElements: Template[], parent?: Template);
}
