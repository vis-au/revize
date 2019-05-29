"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3_dsv_1 = require("d3-dsv");
const URLDatasetNode_1 = require("./Datasets/URLDatasetNode");
const TranformNode_1 = require("./Transforms/TranformNode");
const InlineDatasetNode_1 = require("./Datasets/InlineDatasetNode");
class DataImporter {
    constructor() {
        this.onNewDataset = null;
        this.datasets = new Map();
    }
    getFileNameFromURL(url) {
        let name = url;
        // trim off the file type and use the string before it in the url
        if (url.includes('.json')) {
            name = url.match(/\/(\w+)\.json/)[1];
        }
        else if (url.includes('.csv')) {
            name = url.match(/(\w+)\.csv/)[1];
        }
        return name;
    }
    // adapted from https://stackoverflow.com/a/26298948
    readFileFromDisk(e) {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = (onloadEvent) => {
            const contents = onloadEvent.target;
            this.convertCSVToDatasetNode(contents.result);
        };
        reader.readAsText(file);
    }
    convertCSVToDatasetNode(contents) {
        const csvContent = d3_dsv_1.csvParse(contents);
        const datasetNode = new URLDatasetNode_1.URLDatasetNode();
        datasetNode.fields = csvContent.columns;
        datasetNode.name = 'new Dataset';
        datasetNode.values = csvContent;
        if (this.onNewDataset !== null) {
            this.onNewDataset(datasetNode);
        }
    }
    fetchCSV(preset, node = new URLDatasetNode_1.URLDatasetNode()) {
        const reader = new FileReader();
        reader.onloadend = (e) => {
            const dataArray = d3_dsv_1.csvParse(e.srcElement.result);
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
    fetchJSON(preset, node = new URLDatasetNode_1.URLDatasetNode()) {
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
    importPreset(preset, node) {
        if (this.datasets.get(preset.url) !== undefined) {
            return;
        }
        if (preset.url.includes('.json')) {
            this.fetchJSON(preset, node);
        }
        else if (preset.url.includes('.csv')) {
            this.fetchCSV(preset, node);
        }
    }
    loadFieldsAndValuesToNode(node) {
        if (node instanceof URLDatasetNode_1.URLDatasetNode) {
            this.importPreset(node.getSchema(), node);
        }
        else if (node instanceof InlineDatasetNode_1.InlineDatasetNode) {
            const values = node.values;
            if (values === undefined || values.length === 0) {
                return;
            }
            node.fields = Object.keys(values[0]);
        }
        else if (node instanceof TranformNode_1.TransformNode) {
            const rootDatasetNode = node.getRootDatasetNode();
            if (rootDatasetNode !== null) {
                this.loadFieldsAndValuesToNode(rootDatasetNode);
            }
        }
    }
}
exports.DataImporter = DataImporter;
