import { FacetFieldDef, FacetMapping } from 'vega-lite/build/src/spec/facet';
import { Field } from 'vega-lite/build/src/channeldef';

import { CompositionView } from './CompositionView';
import { View } from './View';

export class FacetView extends CompositionView {
  public facet: FacetFieldDef<Field> | FacetMapping<Field>;
  public isInlineFacetted: boolean;

  constructor(visualElements: View[], parent: View = null) {
    super('facet', visualElements, parent);

    this.isInlineFacetted = false;
  }
}