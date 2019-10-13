import { View } from './View';
export declare class SpecParser {
    private getEncodingsMapFromPlotSchema;
    private setSingleViewProperties;
    private getNonRepeatSubtrees;
    /**
     * In a repeat spec, the bindings inside the child views can reference the repeated fields
     * instead of fields from the data. In order to render such a view without its parent,
     * modify this binding to the first entries in the repeated fields of the parent
     */
    private removeRepeatFromChildViews;
    private getRepeatView;
    private getFacetView;
    private getLayerView;
    private getConcatView;
    private getCompositionView;
    private getPlotView;
    private getRootDatasetNode;
    private getLeafTransformNode;
    private parseDataTransformation;
    parse(schema: any): View;
}
