import { CompositionTemplate } from './CompositionTemplate';
import { Template } from './Template';

export class ConcatTemplate extends CompositionTemplate {
  public isVertical: boolean = true;
  public isWrappable: boolean = false;

  constructor(visualElements: Template[], parent: Template = null) {
    super('concatenate', visualElements, parent);
  }
}