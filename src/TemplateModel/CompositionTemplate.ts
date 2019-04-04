import { LayoutAlign } from 'vega';
import { Resolve } from 'vega-lite/build/src/resolve';
import { RowCol } from 'vega-lite/build/src/vega.schema';

import { Composition } from './LayoutType';
import { Template } from './Template';

export abstract class CompositionTemplate extends Template {
  public resolve: Resolve;
  public center: boolean | RowCol<boolean>;
  public align: LayoutAlign | RowCol<LayoutAlign>;
  public columns: number;
  public spacing: number;

  constructor(composition: Composition, visualElements: Template[], parent: Template = null) {
    super(visualElements, composition, parent);
  }
}