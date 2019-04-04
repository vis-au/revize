import { Data } from 'vega-lite/build/src/data';
import { Datasets } from 'vega-lite/build/src/spec/toplevel';
import { Transform } from 'vega-lite/build/src/transform';

import { TransformNode } from './Transforms/TranformNode';

export abstract class GraphNode {
  public readonly id: string;
  public myName: string;
  public parent: GraphNode;
  public children: TransformNode[];

  constructor() {
    this.id = `node${Math.floor(Math.random() * 1000000)}`;
    this.myName = '';
    this.parent = null;
    this.children = [];
  }

  public abstract getSchema(): Data;

  public abstract setSchema(schema: Data): void;

  public abstract getTransform(): Transform[];

  public getAllChildNodes(): TransformNode[] {
    const allChildNodes = this.children.map(n => n);

    this.children.forEach(childNode => {
      allChildNodes.push(...childNode.getAllChildNodes());
    });

    return allChildNodes;
  }

  public getFullAncestry(): GraphNode[] {
    const allParentNodes: GraphNode[] = [this];
    let workingNode: GraphNode = this.parent;

    if (this.parent === null) {
      return allParentNodes;
    }

    // go up in the node's hierarchy as far as possible
    while (workingNode !== null) {
      allParentNodes.push(workingNode);
      workingNode = workingNode.parent;
    }

    return allParentNodes.reverse();
  }

  public get name(): string {
    if (this.myName === undefined) {
      return this.id;
    }

    return this.myName;
  }

  public set name(name: string) {
    if (name === undefined) {
      name = this.id;
    }

    this.myName = name;
  }
}