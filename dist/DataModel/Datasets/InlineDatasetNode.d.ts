import { DataFormat, InlineData } from 'vega-lite/build/src/data';
import { Transform } from 'vega-lite/build/src/transform';
import { DatasetNode } from './DatasetNode';
export declare class InlineDatasetNode extends DatasetNode {
    format?: DataFormat;
    getSchema(): InlineData & {
        transform: Transform[];
    };
    setSchema(data: InlineData): void;
}
