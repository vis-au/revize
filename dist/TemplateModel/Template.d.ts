import { Config } from 'vega-lite';
import { Data } from 'vega-lite/build/src/data';
import { Transform } from 'vega-lite/build/src/transform';
import { Datasets } from 'vega-lite/build/src/spec/toplevel';
import { GraphNode } from '../DataModel/GraphNode';
import { LayoutType } from './LayoutType';
import { MarkEncoding } from './MarkEncoding';
export declare abstract class Template {
    visualElements: Template[];
    layout: LayoutType;
    parent: Template;
    id: string;
    hierarchyLevel: number;
    private dataNode;
    datasets: Datasets;
    description: string;
    bounds: any;
    width: number;
    height: number;
    config: Config;
    encodings: Map<MarkEncoding, any>;
    overwrittenEncodings: Map<MarkEncoding, any>;
    constructor(visualElements: Template[], layout: LayoutType, parent: Template);
    /**
     * Returns the flattened hierarchy of templates succeeding this one.
     */
    getFlatHierarchy(): Template[];
    /**
     * Returns the hierarchy level of this template, starting at 0.
     */
    getHierarchyLevel(): number;
    setEncodedValue(encoding: MarkEncoding, value: any): void;
    getEncodedValue(encoding: MarkEncoding): any;
    deleteEncodedValue(encoding: MarkEncoding): void;
    dataTransformationNode: GraphNode;
    readonly data: Data;
    readonly transform: Transform[];
}
