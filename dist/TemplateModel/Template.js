"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Template {
    constructor(visualElements, layout, parent) {
        this.visualElements = visualElements;
        this.layout = layout;
        this.parent = parent;
        this.id = `template${Math.round(Math.random() * 10000)}`;
        this.hierarchyLevel = -1;
        this.dataNode = null;
        this.encodings = new Map();
        this.overwrittenEncodings = new Map();
    }
    /**
     * Returns the flattened hierarchy of templates succeeding this one.
     */
    getFlatHierarchy() {
        const successors = [];
        successors.push(this);
        this.visualElements.forEach(successor => {
            successors.push(...successor.getFlatHierarchy());
        });
        return successors;
    }
    /**
     * Returns the hierarchy level of this template, starting at 0.
     */
    getHierarchyLevel() {
        if (this.hierarchyLevel > -1) {
            return this.hierarchyLevel;
        }
        // since the template may have visual elements from different leves, output the highest value
        // between all sub-hierarchies
        if (this.visualElements.length === 0) {
            return 0;
        }
        const subHierarchies = this.visualElements.map(v => v.getHierarchyLevel());
        this.hierarchyLevel = Math.max(...subHierarchies) + 1;
        return this.hierarchyLevel;
    }
    setEncodedValue(encoding, value) {
        this.encodings.set(encoding, value);
    }
    getEncodedValue(encoding) {
        return this.encodings.get(encoding);
    }
    set dataTransformationNode(transformNode) {
        this.dataNode = transformNode;
    }
    get dataTransformationNode() {
        return this.dataNode;
    }
    get data() {
        if (this.dataNode === null) {
            return null;
        }
        const data = this.dataNode.getSchema();
        return data;
    }
    get transform() {
        if (this.dataNode === null) {
            return [];
        }
        const transform = this.dataNode.getTransform();
        return transform;
    }
}
exports.Template = Template;
