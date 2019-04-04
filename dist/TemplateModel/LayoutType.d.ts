export declare type Composition = 'repeat' | 'concatenate' | 'overlay' | 'facet';
export declare type Plot = 'node-link' | 'bubble chart' | 'timeline' | 'radius' | 'angular' | 'polar coordinates' | 'cartesian' | 'histogram' | 'parallel plot' | 'star plot';
export declare type LayoutType = Composition | Plot;
export declare const COMPOSITION_TYPES: LayoutType[];
export declare const PLOT_TYPES: LayoutType[];
export declare const layouts: LayoutType[];
