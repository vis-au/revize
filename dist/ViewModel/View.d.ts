import { Config } from 'vega-lite';
import { Data } from 'vega-lite/build/src/data';
import { Transform } from 'vega-lite/build/src/transform';
import { Datasets } from 'vega-lite/build/src/spec/toplevel';
import { Projection } from 'vega-lite/build/src/projection';
import { GraphNode } from '../DataModel/GraphNode';
import { LayoutType } from './LayoutType';
import { MarkEncoding } from './MarkEncoding';
export declare abstract class View {
    visualElements: View[];
    layout: LayoutType;
    parent: View;
    id: string;
    hierarchyLevel: number;
    private dataNode;
    datasets: Datasets;
    description: string;
    bounds: any;
    width: number;
    height: number;
    config: Config;
    projection: Projection;
    encodings: Map<MarkEncoding, any>;
    overwrittenEncodings: Map<MarkEncoding, any>;
    constructor(visualElements: View[], layout: LayoutType, parent: View);
    /**
     * Returns the flattened hierarchy of views succeeding this one.
     */
    getFlatHierarchy(): View[];
    /**
     * Returns the hierarchy level of this view, starting at 0.
     */
    getHierarchyLevel(): number;
    setEncodedValue(encoding: MarkEncoding, value: any): void;
    getEncodedValue(encoding: MarkEncoding): any;
    deleteEncodedValue(encoding: MarkEncoding): void;
    dataTransformationNode: GraphNode;
    readonly data: Data;
    readonly transform: Transform[];
}
