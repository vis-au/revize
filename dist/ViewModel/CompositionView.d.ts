import { LayoutAlign } from 'vega';
import { Resolve } from 'vega-lite/build/src/resolve';
import { RowCol } from 'vega-lite/build/src/vega.schema';
import { Composition } from './LayoutType';
import { View } from './View';
export declare abstract class CompositionView extends View {
    resolve: Resolve;
    center: boolean | RowCol<boolean>;
    align: LayoutAlign | RowCol<LayoutAlign>;
    columns: number;
    spacing: number;
    constructor(composition: Composition, visualElements: View[], parent?: View);
}
