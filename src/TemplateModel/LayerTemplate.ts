import { CompositionTemplate } from './CompositionTemplate';
import { MarkEncoding } from './MarkEncoding';
import { Template } from './Template';

export class LayerTemplate extends CompositionTemplate {
  public groupEncodings: Map<MarkEncoding, any>;

  constructor(visualElements: Template[], parent: Template = null) {
    super('overlay', visualElements, parent);
    this.groupEncodings = new Map();
  }
}