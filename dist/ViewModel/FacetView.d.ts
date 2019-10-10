import { FacetFieldDef, FacetMapping } from 'vega-lite/build/src/spec/facet';
import { Field } from 'vega-lite/build/src/channeldef';
import { CompositionView } from './CompositionView';
import { View } from './View';
export declare class FacetView extends CompositionView {
    facet: FacetFieldDef<Field> | FacetMapping<Field>;
    isInlineFacetted: boolean;
    constructor(visualElements: View[], parent?: View);
}
