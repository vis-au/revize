import { DataFormat, NamedData } from 'vega-lite/build/src/data';
import { Transform } from 'vega-lite/build/src/transform';
import { DatasetNode } from './DatasetNode';
export declare class NamedDataSourceNode extends DatasetNode {
    format: DataFormat;
    getSchema(): NamedData & {
        transform: Transform[];
    };
    setSchema(data: NamedData): void;
}
