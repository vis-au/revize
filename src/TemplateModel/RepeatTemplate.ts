import { RepeatMapping } from 'vega-lite/build/src/spec/repeat';
import { CompositionTemplate } from './CompositionTemplate';
import { Template } from './Template';

export class RepeatTemplate extends CompositionTemplate {
  public repeat: RepeatMapping = {};

  constructor(visualElements: Template[], parent: Template = null) {
    super('repeat', visualElements, parent);
  }
}