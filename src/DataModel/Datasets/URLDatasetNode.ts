import { DataFormat, UrlData } from 'vega-lite/build/src/data';
import { DatasetNode } from './DatasetNode';

export class URLDatasetNode extends DatasetNode {
  public url: string;
  public format: DataFormat;

  public getSchema(): UrlData {
    return {
      name: this.name,
      url: this.url,
      format: this.format
    }
  }

  public setSchema(data: UrlData) {
    this.name = data.name;
    this.url = data.url;
    this.format = data.format;
  }
}