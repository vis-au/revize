import { csvParse } from 'd3-dsv';

import { DatasetNode } from './Datasets/DatasetNode';
import { URLDatasetNode } from './Datasets/URLDatasetNode';
import { GraphNode } from './GraphNode';
import { TransformNode } from './Transforms/TranformNode';
import { UrlData } from 'vega-lite/build/src/data';

export class DataImporter {
  public onNewDataset: (d?: DatasetNode) => void;
  private datasets: Map<string, DatasetNode>; // url -> dataset

  constructor() {
    this.onNewDataset = null;
    this.datasets = new Map();
  }

  private getFileNameFromURL(url: string) {
    let name = url;

    // trim off the file type and use the string before it in the url
    if (url.includes('.json')) {
      name = url.match(/\/(\w+)\.json/)[1];
    } else if (url.includes('.csv')) {
      name = url.match(/\/(\w+)\.csv/)[1];
    }

    return name;
  }

  // adapted from https://stackoverflow.com/a/26298948
  public readFileFromDisk(e: any) {

    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (onloadEvent: any) => {
      const contents = onloadEvent.target;
      this.convertCSVToDatasetNode(contents.result);
    }

    reader.readAsText(file);
  }

  private convertCSVToDatasetNode(contents: any) {
    const csvContent = csvParse(contents);
    const datasetNode = new URLDatasetNode();

    datasetNode.fields = csvContent.columns;
    datasetNode.name = 'new Dataset';
    datasetNode.values = csvContent;

    if (this.onNewDataset !== null) {
      this.onNewDataset(datasetNode);
    }
  }

  private fetchCSV(preset: UrlData, node: URLDatasetNode = new URLDatasetNode()) {
    const reader = new FileReader();

    reader.onloadend = (e: any) => {
      const dataArray = csvParse(e.srcElement.result);
      node.fields = Object.keys(dataArray[0]);
      node.values = dataArray;
      node.name = this.getFileNameFromURL(preset.url);
      node.url = preset.url;

      this.datasets.set(node.url, node);

      if (this.onNewDataset !== null) {
        this.onNewDataset(node);
      }
    };

    fetch(preset.url)
      .then(res => res.blob())
      .then(blob => reader.readAsText(blob));
  }

  private fetchJSON(preset: UrlData, node: URLDatasetNode = new URLDatasetNode()) {
    fetch(preset.url)
      .then(response => response.json())
      .then(dataArray => {
        node.fields = Object.keys(dataArray[0]);
        node.values = dataArray;

        node.name = this.getFileNameFromURL(preset.url);
        node.url = preset.url;
        node.format = preset.format;

        this.datasets.set(node.url, node);

        if (this.onNewDataset !== null) {
          this.onNewDataset(node);
        }
      });
  }

  public importPreset(preset: UrlData, node?: URLDatasetNode) {
    if (this.datasets.get(preset.url) !== undefined) {
      return;
    }

    if (preset.url.includes('.json')) {
      this.fetchJSON(preset, node);
    } else if (preset.url.includes('.csv')) {
      this.fetchCSV(preset, node);
    }
  }

  public loadFieldsAndValuesToNode(node: GraphNode) {
    if (node instanceof URLDatasetNode) {
      this.importPreset(node.getSchema(), node);
    } else if (node instanceof TransformNode) {
      const rootDatasetNode = node.getRootDatasetNode();
      if (rootDatasetNode !== null) {
        this.loadFieldsAndValuesToNode(rootDatasetNode);
      }
    }
  }
}