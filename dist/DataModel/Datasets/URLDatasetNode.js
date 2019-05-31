"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatasetNode_1 = require("./DatasetNode");
class URLDatasetNode extends DatasetNode_1.DatasetNode {
    getSchema() {
        return {
            name: this.name,
            url: this.url,
            format: this.format
        };
    }
    setSchema(data) {
        this.name = data.name;
        this.url = data.url;
        this.format = data.format;
    }
}
exports.URLDatasetNode = URLDatasetNode;
