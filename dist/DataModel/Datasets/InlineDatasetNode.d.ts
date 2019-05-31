import { DataFormat, InlineData } from 'vega-lite/build/src/data';
import { DatasetNode } from './DatasetNode';
export declare class InlineDatasetNode extends DatasetNode {
    format?: DataFormat;
    getSchema(): InlineData;
    setSchema(data: InlineData): void;
}
