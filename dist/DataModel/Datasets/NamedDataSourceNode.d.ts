import { DataFormat, NamedData } from 'vega-lite/build/src/data';
import { DatasetNode } from './DatasetNode';
export declare class NamedDataSourceNode extends DatasetNode {
    format: DataFormat;
    getSchema(): NamedData;
    setSchema(data: NamedData): void;
}
