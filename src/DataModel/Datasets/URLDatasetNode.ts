import { DataFormat, UrlData } from 'vega-lite/build/src/data';
import { Transform } from 'vega-lite/build/src/transform';
import { DatasetNode } from './DatasetNode';

export class URLDatasetNode extends DatasetNode {
  public url: string;
  public format: DataFormat;

  public getSchema(): UrlData & { transform: Transform[] } {
    return {
      name: this.name,
      url: this.url,
      format: this.format,
      transform: this.getAllChildNodes().map(t => t.transform)
    }
  }

  public setSchema(data: UrlData) {
    this.name = data.name;
    this.url = data.url;
    this.format = data.format;
  }
}