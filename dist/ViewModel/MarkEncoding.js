"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.positionEncodings = ['x', 'y', 'x2', 'y2'];
exports.geographicPositionEncodings = ['longitude', 'latitude'];
exports.markPropertiesChannelEncodings = [
    'filled', 'color', 'fill', 'stroke', 'opacity', 'fillOpacity', 'strokeOpacity', 'size', 'shape',
    'strokeCap', 'strokeDash', 'strokeDashOffset', 'strokeJoin', 'strokeMiterLimit', 'strokeWidth'
];
exports.textTooltipChannelEncodings = ['text', 'tooltip'];
exports.hyperLinkChannelEncodings = ['href', 'cursor'];
exports.keyChannelEncodings = ['key'];
exports.orderChannelEncodings = ['order'];
exports.loDChannelEncodings = ['detail'];
exports.facetChannelEncodings = ['facet', 'row', 'column'];
exports.markEncodings = exports.positionEncodings
    .concat(exports.geographicPositionEncodings)
    .concat(exports.markPropertiesChannelEncodings)
    .concat(exports.textTooltipChannelEncodings)
    .concat(exports.hyperLinkChannelEncodings)
    .concat(exports.orderChannelEncodings)
    .concat(exports.loDChannelEncodings)
    .concat(exports.facetChannelEncodings);
exports.markEncodingGroups = [
    'position', 'geographic', 'mark property', 'text tooltip', 'hyperlink', 'key channel',
    'order channel', 'lod channel', 'facet channel'
];
