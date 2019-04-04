import { InlineDataset } from 'vega-lite/build/src/data';
import { Transform } from 'vega-lite/build/src/transform';
import { GraphNode } from '../GraphNode';
export declare abstract class DatasetNode extends GraphNode {
    fields: string[];
    values: InlineDataset;
    constructor();
    getTransform(): Transform[];
}
