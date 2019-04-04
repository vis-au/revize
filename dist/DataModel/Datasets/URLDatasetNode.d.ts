import { DataFormat, UrlData } from 'vega-lite/build/src/data';
import { Transform } from 'vega-lite/build/src/transform';
import { DatasetNode } from './DatasetNode';
export declare class URLDatasetNode extends DatasetNode {
    url: string;
    format: DataFormat;
    getSchema(): UrlData & {
        transform: Transform[];
    };
    setSchema(data: UrlData): void;
}
