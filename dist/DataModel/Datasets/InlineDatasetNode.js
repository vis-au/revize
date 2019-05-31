"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatasetNode_1 = require("./DatasetNode");
class InlineDatasetNode extends DatasetNode_1.DatasetNode {
    getSchema() {
        return {
            name: this.name,
            values: this.values,
            format: this.format
        };
    }
    setSchema(data) {
        this.name = data.name;
        this.values = data.values;
        this.format = data.format;
    }
}
exports.InlineDatasetNode = InlineDatasetNode;
