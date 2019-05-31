import { DataFormat, NamedData } from 'vega-lite/build/src/data';
import { DatasetNode } from './DatasetNode';

export class NamedDataSourceNode extends DatasetNode {
  public format: DataFormat;

  public getSchema(): NamedData {
    return {
      name: this.name,
      format: this.format
    }
  }

  public setSchema(data: NamedData) {
    this.name = data.name;
    this.format = data.format;
  }
}