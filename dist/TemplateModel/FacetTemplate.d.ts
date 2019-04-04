import { FacetFieldDef, FacetMapping } from 'vega-lite/build/src/spec/facet';
import { Field } from 'vega-lite/build/src/channeldef';
import { CompositionTemplate } from './CompositionTemplate';
import { Template } from './Template';
export declare class FacetTemplate extends CompositionTemplate {
    facet: FacetFieldDef<Field> | FacetMapping<Field>;
    isInlineFacetted: boolean;
    constructor(visualElements: Template[], parent?: Template);
}
