export type Composition = 'repeat' | 'concatenate' | 'overlay' | 'facet';
export type Plot = 'node-link' | 'bubble chart' | 'timeline' | 'radius' | 'angular' |
  'polar coordinates' | 'cartesian' | 'histogram' | 'parallel plot' | 'star plot';

export type LayoutType = Composition | Plot;
export const COMPOSITION_TYPES: LayoutType[] = ['repeat', 'overlay', 'facet', 'concatenate'];
export const PLOT_TYPES: LayoutType[] = ['node-link', 'bubble chart', 'timeline', 'radius',
  'angular', 'polar coordinates', 'cartesian', 'histogram', 'parallel plot', 'star plot'];

export const layouts: LayoutType[] = PLOT_TYPES.concat(COMPOSITION_TYPES);