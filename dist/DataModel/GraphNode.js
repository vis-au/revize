"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GraphNode {
    constructor() {
        this.id = `node${Math.floor(Math.random() * 1000000)}`;
        this.myName = '';
        this.parent = null;
        this.children = [];
    }
    getAllChildNodes() {
        const allChildNodes = this.children.map(n => n);
        this.children.forEach(childNode => {
            allChildNodes.push(...childNode.getAllChildNodes());
        });
        return allChildNodes;
    }
    getFullAncestry() {
        const allParentNodes = [this];
        let workingNode = this.parent;
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
    get name() {
        if (this.myName.length === 0) {
            return "Unnamed Dataset";
        }
        return this.myName;
    }
    set name(name) {
        if (name === undefined) {
            name = '';
        }
        this.myName = name;
    }
}
exports.GraphNode = GraphNode;
