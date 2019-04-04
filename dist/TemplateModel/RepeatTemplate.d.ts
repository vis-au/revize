import { RepeatMapping } from 'vega-lite/build/src/spec/repeat';
import { CompositionTemplate } from './CompositionTemplate';
import { Template } from './Template';
export declare class RepeatTemplate extends CompositionTemplate {
    repeat: RepeatMapping;
    constructor(visualElements: Template[], parent?: Template);
}
