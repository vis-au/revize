import { RepeatMapping } from 'vega-lite/build/src/spec/repeat';
import { CompositionView } from './CompositionView';
import { View } from './View';

export class RepeatView extends CompositionView {
  public repeat: RepeatMapping = {};

  constructor(visualElements: View[], parent: View = null) {
    super('repeat', visualElements, parent);
  }
}