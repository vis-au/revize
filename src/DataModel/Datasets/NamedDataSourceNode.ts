import { DataFormat, NamedData } from 'vega-lite/build/src/data';
import { Transform } from 'vega-lite/build/src/transform';
import { DatasetNode } from './DatasetNode';

export class NamedDataSourceNode extends DatasetNode {
  public format: DataFormat;

  public getSchema(): NamedData & { transform: Transform[] } {
    return {
      name: this.name,
      format: this.format,
      transform: this.getAllChildNodes().map(t => t.transform)
    }
  }

  public setSchema(data: NamedData) {
    this.name = data.name;
    this.format = data.format;
  }
}