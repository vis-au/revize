import { Data } from 'vega-lite/build/src/data';
import { Transform } from 'vega-lite/build/src/transform';
import { TransformNode } from './Transforms/TranformNode';
export declare abstract class GraphNode {
    readonly id: string;
    myName: string;
    parent: GraphNode;
    children: TransformNode[];
    constructor();
    abstract getSchema(): Data;
    abstract setSchema(schema: Data): void;
    abstract getTransform(): Transform[];
    getAllChildNodes(): TransformNode[];
    getFullAncestry(): GraphNode[];
    get name(): string;
    set name(name: string);
}
