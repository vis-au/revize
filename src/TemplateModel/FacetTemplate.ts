import { FacetFieldDef, FacetMapping } from 'vega-lite/build/src/spec/facet';
import { Field } from 'vega-lite/build/src/channeldef';

import { CompositionTemplate } from './CompositionTemplate';
import { Template } from './Template';

export class FacetTemplate extends CompositionTemplate {
  public facet: FacetFieldDef<Field> | FacetMapping<Field>;
  public isInlineFacetted: boolean;

  constructor(visualElements: Template[], parent: Template = null) {
    super('facet', visualElements, parent);

    this.isInlineFacetted = false;
  }
}