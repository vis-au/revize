import { LayoutAlign } from 'vega';
import { Resolve } from 'vega-lite/build/src/resolve';
import { RowCol } from 'vega-lite/build/src/vega.schema';

import { Composition } from './LayoutType';
import { View } from './View';

export abstract class CompositionView extends View {
  public resolve: Resolve;
  public center: boolean | RowCol<boolean>;
  public align: LayoutAlign | RowCol<LayoutAlign>;
  public columns: number;
  public spacing: number;

  constructor(composition: Composition, visualElements: View[], parent: View = null) {
    super(visualElements, composition, parent);
  }
}