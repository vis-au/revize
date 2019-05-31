import { DataFormat, UrlData } from 'vega-lite/build/src/data';
import { DatasetNode } from './DatasetNode';
export declare class URLDatasetNode extends DatasetNode {
    url: string;
    format: DataFormat;
    getSchema(): UrlData;
    setSchema(data: UrlData): void;
}
