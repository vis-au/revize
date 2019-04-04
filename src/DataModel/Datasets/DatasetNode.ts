
import { InlineDataset } from 'vega-lite/build/src/data';
import { Transform } from 'vega-lite/build/src/transform';
import { GraphNode } from '../GraphNode';

export abstract class DatasetNode extends GraphNode {
  public fields: string[];
  public values: InlineDataset;

  constructor() {
    super();

    this.fields = [];
    this.values = [];
  }

  public getTransform(): Transform[] {
    // datasets are roots in a data graph and therefore do not have parent or child transforms
    return [];
  }
}