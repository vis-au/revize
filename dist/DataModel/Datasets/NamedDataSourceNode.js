"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatasetNode_1 = require("./DatasetNode");
class NamedDataSourceNode extends DatasetNode_1.DatasetNode {
    getSchema() {
        return {
            name: this.name,
            format: this.format
        };
    }
    setSchema(data) {
        this.name = data.name;
        this.format = data.format;
    }
}
exports.NamedDataSourceNode = NamedDataSourceNode;
