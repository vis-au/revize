import { Data } from 'vega-lite/build/src/data';
import { Transform } from 'vega-lite/build/src/transform';
import { DatasetNode } from '../Datasets/DatasetNode';
import { GraphNode } from '../GraphNode';
import { TransformName } from './TransformTypes';
export declare class TransformNode extends GraphNode {
    type: TransformName;
    transform: Transform;
    getRootDatasetNode(): DatasetNode;
    getSchema(): any;
    setSchema(data: Data): void;
    getTransform(): Transform[];
}
