import { View } from './View';
export declare class SpecParser {
    private getEncodingsMapFromPlotSchema;
    private setSingleViewProperties;
    private getNonRepeatSubtrees;
    /**
     * In a repeat spec, the bindings inside the child templates can reference the repeated fields
     * instead of fields from the data. In order to render such a template without its parent,
     * modify this binding to the first entries in the repeated fields of the parent
     */
    private removeRepeatFromChildTemplates;
    private getRepeatTemplate;
    private getFacetTemplate;
    private getLayerTemplate;
    private getConcatTemplate;
    private getCompositionTemplate;
    private getPlotTemplate;
    private getRootDatasetNode;
    private getLeafTransformNode;
    private parseDataTransformation;
    parse(schema: any): View;
}
