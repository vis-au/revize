import { FieldDef, MarkPropFieldDef, ValueDef } from 'vega-lite/build/src/fielddef';

export type PositionEncoding = 'x' | 'y' | 'x2' | 'y2';
export const positionEncodings: PositionEncoding[] = ['x', 'y', 'x2', 'y2'];

export type GeographicPositionEncoding = 'longitude' | 'latitude';
export const geographicPositionEncodings: GeographicPositionEncoding[] = ['longitude', 'latitude'];

export type MarkPropertiesChannelEncoding = 'filled' | 'color' | 'fill' | 'stroke' | 'opacity'
  | 'fillOpacity' | 'strokeOpacity' | 'size' | 'shape' | 'strokeCap' | 'strokeDash'
  | 'strokeDashOffset' | 'strokeJoin' | 'strokeMiterLimit' | 'strokeWidth';
export const markPropertiesChannelEncodings: MarkPropertiesChannelEncoding[] = [
  'filled', 'color', 'fill', 'stroke', 'opacity', 'fillOpacity', 'strokeOpacity', 'size', 'shape',
  'strokeCap', 'strokeDash', 'strokeDashOffset', 'strokeJoin', 'strokeMiterLimit', 'strokeWidth'
];

export type TextTooltipChannelEncoding = 'text' | 'tooltip';
export const textTooltipChannelEncodings: TextTooltipChannelEncoding[] = ['text', 'tooltip'];

export type HyperLinkChannelEncoding = 'href' | 'cursor';
export const hyperLinkChannelEncodings: HyperLinkChannelEncoding[] = ['href', 'cursor'];

export type KeyChannelEncoding = 'key';
export const keyChannelEncodings: KeyChannelEncoding[] = ['key'];

export type OrderChannelEncoding = 'order';
export const orderChannelEncodings: OrderChannelEncoding[] = ['order'];

export type LoDChannelEncoding = 'detail';
export const loDChannelEncodings: LoDChannelEncoding[] = ['detail'];

export type FacetChannelEncoding = 'facet' | 'row' | 'column';
export const facetChannelEncodings: FacetChannelEncoding[] = ['facet', 'row', 'column'];


export type MarkEncoding = PositionEncoding | GeographicPositionEncoding
  | MarkPropertiesChannelEncoding | TextTooltipChannelEncoding | HyperLinkChannelEncoding
  | KeyChannelEncoding |  OrderChannelEncoding | LoDChannelEncoding | FacetChannelEncoding;

export const markEncodings: MarkEncoding[] = (positionEncodings as MarkEncoding[])
  .concat(geographicPositionEncodings)
  .concat(markPropertiesChannelEncodings)
  .concat(textTooltipChannelEncodings)
  .concat(hyperLinkChannelEncodings)
  .concat(orderChannelEncodings)
  .concat(loDChannelEncodings)
  .concat(facetChannelEncodings);

export type MarkEncodingGroup = 'position' | 'geographic' | 'mark property' | 'text tooltip'
  | 'hyperlink' | 'key channel' | 'order channel' | 'lod channel' | 'facet channel';

export const markEncodingGroups: MarkEncodingGroup[] = [
  'position', 'geographic', 'mark property', 'text tooltip', 'hyperlink', 'key channel',
  'order channel', 'lod channel', 'facet channel'
];

export type EncodingsType = FieldDef<any> | ValueDef | MarkPropFieldDef<any>