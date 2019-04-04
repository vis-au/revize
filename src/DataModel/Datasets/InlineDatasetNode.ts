import { DataFormat, InlineData } from 'vega-lite/build/src/data';
import { Transform } from 'vega-lite/build/src/transform';
import { DatasetNode } from './DatasetNode';

export class InlineDatasetNode extends DatasetNode {
  public format?: DataFormat;

  public getSchema(): InlineData & { transform: Transform[] } {
    return {
      name: this.name,
      values: this.values,
      format: this.format,
      transform: this.getAllChildNodes().map(t => t.transform)
    };
  }

  public setSchema(data: InlineData) {
    this.name = data.name;
    this.values = data.values;
    this.format = data.format;
  }
}