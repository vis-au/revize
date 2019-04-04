import { Template } from './Template';
export declare class SpecCompiler {
    getBasicSchema(template?: Template): any;
    private setCompositionProperties;
    private setToplevelProperties;
    private getRootTemplate;
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
    getVegaSpecification(template: Template, inferProperties?: boolean, useOverwrittenEncodings?: boolean): any;
}
