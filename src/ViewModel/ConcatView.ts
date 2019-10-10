import { CompositionView } from './CompositionView';
import { View } from './View';

export class ConcatView extends CompositionView {
  public isVertical: boolean = true;
  public isWrappable: boolean = false;

  constructor(visualElements: View[], parent: View = null) {
    super('concatenate', visualElements, parent);
  }
}