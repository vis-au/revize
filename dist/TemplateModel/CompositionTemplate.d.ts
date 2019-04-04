import { LayoutAlign } from 'vega';
import { Resolve } from 'vega-lite/build/src/resolve';
import { RowCol } from 'vega-lite/build/src/vega.schema';
import { Composition } from './LayoutType';
import { Template } from './Template';
export declare abstract class CompositionTemplate extends Template {
    resolve: Resolve;
    center: boolean | RowCol<boolean>;
    align: LayoutAlign | RowCol<LayoutAlign>;
    columns: number;
    spacing: number;
    constructor(composition: Composition, visualElements: Template[], parent?: Template);
}
