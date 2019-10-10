import { CompositionView } from './CompositionView';
import { MarkEncoding } from './MarkEncoding';
import { View } from './View';

export class LayerView extends CompositionView {
  public groupEncodings: Map<MarkEncoding, any>;

  constructor(visualElements: View[], parent: View = null) {
    super('overlay', visualElements, parent);
    this.groupEncodings = new Map();
  }
}