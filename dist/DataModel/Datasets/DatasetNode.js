"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatasetNode = void 0;
const GraphNode_1 = require("../GraphNode");
class DatasetNode extends GraphNode_1.GraphNode {
    constructor() {
        super();
        this.fields = [];
        this.values = [];
    }
    getTransform() {
        // datasets are roots in a data graph and therefore do not have parent or child transforms
        return [];
    }
}
exports.DatasetNode = DatasetNode;
