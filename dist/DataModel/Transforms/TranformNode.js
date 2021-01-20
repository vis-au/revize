"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformNode = void 0;
const DatasetNode_1 = require("../Datasets/DatasetNode");
const GraphNode_1 = require("../GraphNode");
class TransformNode extends GraphNode_1.GraphNode {
    getRootDatasetNode() {
        if (this.parent === null) {
            return null;
        }
        let workingNode = this.parent;
        // go up in the node's hierarchy as far as possible
        while (workingNode.parent !== null) {
            workingNode = workingNode.parent;
        }
        if (!(workingNode instanceof DatasetNode_1.DatasetNode)) {
            return null;
        }
        return workingNode;
    }
    getSchema() {
        const rootDataset = this.getRootDatasetNode();
        return rootDataset.getSchema();
    }
    setSchema(data) {
        return;
    }
    getTransform() {
        const transformNodesOnPathToRoot = this.getFullAncestry();
        const transforms = transformNodesOnPathToRoot
            .filter(n => n instanceof TransformNode)
            .map((n) => n.transform);
        return transforms;
    }
}
exports.TransformNode = TransformNode;
