import { View } from './View';
export declare class SpecCompiler {
    getBasicSchema(view?: View): any;
    private setCompositionProperties;
    private setToplevelProperties;
    private getRootView;
    private abstractCompositions;
    private applyRepeatLayout;
    private applyFacetLayout;
    private applyConcatLayout;
    private applyOverlayLayout;
    private applyCompositionLayout;
    private getDataInHierarchy;
    private getDatasetsInAncestry;
    private getRepeatSpec;
    private getFacetSpec;
    private getMultiViewSpec;
    private getPlotSchema;
    private getCompositionSchema;
    getVegaSpecification(view: View, inferProperties?: boolean, useOverwrittenEncodings?: boolean): any;
}
