import { ExtendedLayerSpec, isAnyConcatSpec, isFacetSpec, isLayerSpec, isRepeatSpec, isUnitSpec, NormalizedConcatSpec, NormalizedFacetSpec, NormalizedLayerSpec, NormalizedRepeatSpec, NormalizedUnitSpec } from 'vega-lite/build/src/spec';
import { isConcatSpec, isHConcatSpec, isVConcatSpec } from 'vega-lite/build/src/spec/concat';
import { Datasets } from 'vega-lite/build/src/spec/toplevel';
import { Composition } from './LayoutType';
import { MarkEncoding, markEncodings } from './MarkEncoding';
import { View } from './View';


export function isAtomicSchema(schema: any): boolean {
  return isUnitSpec(schema) && !isFacetSchema(schema);
};

export function isOverlaySchema(schema: any): boolean {
  return isLayerSpec(schema);
};

export function isRepeatSchema(schema: any): boolean {
  return isRepeatSpec(schema);
};

export function isConcatenateSchema(schema: any): boolean {
  return isAnyConcatSpec(schema) || isConcatSpec(schema);
};

export function isInlineFacetSchema(schema: any): boolean {
  return (schema.encoding !== undefined && schema.encoding.facet !== undefined);
}
export function isFacetSchema(schema: any): boolean {
  return isFacetSpec(schema) || isInlineFacetSchema(schema);
};

export function isCompositionSchema(schema: any): boolean {
  return isOverlaySchema(schema)
    || isRepeatSchema(schema)
    || isConcatenateSchema(schema)
    || isFacetSchema(schema);
};

export function isPlotSchema(schema: any) {
  return isAtomicSchema(schema);
};

export function getCompositionType(schema: any): Composition {
  if (isOverlaySchema(schema)) {
    return 'overlay';
  } else if (isRepeatSchema(schema)) {
    return 'repeat';
  } else if (isConcatenateSchema(schema)) {
    return 'concatenate';
  } else if (isFacetSchema(schema)) {
    return 'facet';
  }

  return null;
};

export function getLayerAbstraction(schema: ExtendedLayerSpec) {
  const currentLayers = JSON.parse(JSON.stringify(schema.layer));
  let currentEncoding: any;

  if (schema.encoding !== undefined) {
    currentEncoding = JSON.parse(JSON.stringify(schema.encoding));
  }

  delete schema.layer;
  delete schema.encoding;

  const abstraction: any = {
    layer: currentLayers
  }

  if (currentEncoding !== undefined) {
    abstraction.encoding = currentEncoding;
  }

  return abstraction;
};

export function getRepeatAbstraction(schema: NormalizedRepeatSpec) {
  const currentSpec = JSON.parse(JSON.stringify(schema.spec));
  const currentRepeat = JSON.parse(JSON.stringify(schema.repeat));

  const abstraction = {
    spec: currentSpec,
    repeat: currentRepeat
  };

  delete schema.spec;
  delete schema.repeat;

  return abstraction;
};

export function getFacetAbstraction(schema: NormalizedFacetSpec) {
  const currentSpec = JSON.parse(JSON.stringify(schema.spec));
  const currentFacet = JSON.parse(JSON.stringify(schema.facet));

  const abstraction = {
    spec: currentSpec,
    facet: currentFacet
  };

  delete schema.spec;
  delete schema.facet;

  return abstraction;
};

export function getConcatAbstraction(schema: NormalizedConcatSpec) {
  let currentConcat: any = null;
  let concatProp: string = null;

  if (isConcatSpec(schema)) {
    concatProp = 'concat';
  } else if (isHConcatSpec(schema))  {
    concatProp = 'hconcat';
  } else if (isVConcatSpec(schema)) {
    concatProp = 'vconcat';
  }

  currentConcat = JSON.parse(JSON.stringify((schema as any)[concatProp]));
  delete (schema as any)[concatProp];

  const abstraction: any = {};
  abstraction[concatProp] = currentConcat;

  return abstraction;
};


export function getMarkPropertiesAsMap(mark: any): Map<MarkEncoding, any> {
  const properties = new Map<MarkEncoding, any>();

  // since every mark encoding could potentially be statically set for a mark, just go through
  // all of them and find the ones that are configured
  markEncodings.forEach(encoding => {
    if (mark[encoding] !== undefined) {
      properties.set(encoding, JSON.parse(JSON.stringify(mark[encoding])));
    }
  });

  return properties;
};

export function getAtomicAbstraction(schema: any) {
  const abstraction: any = {
    mark: JSON.parse(JSON.stringify(schema.mark)),
  };

  if (schema.encoding !== undefined) {
    abstraction.encoding = JSON.parse(JSON.stringify(schema.encoding));
  }

  if (schema.selection !== undefined) {
    abstraction.selection = JSON.parse(JSON.stringify(schema.selection));
  }

  const staticProperties = getMarkPropertiesAsMap(schema.mark);
  staticProperties.forEach((property, key) => {
    abstraction[key] = property;
    delete schema[key];
  });

  delete schema.mark;
  delete schema.encoding;
  delete schema.selection;

  if (isRepeatSchema(schema) && abstraction.encoding !== undefined) {
    if (abstraction.encoding.x !== undefined) {
      abstraction.encoding.x = {
          field: { repeat: 'column' },
          type: abstraction.encoding.x.type
      };
    }
    if (abstraction.encoding.y !== undefined) {
      abstraction.encoding.y = {
          field: { repeat: 'row' },
          type: abstraction.encoding.y.type
      };
    }
  } else if (isFacetSchema(schema)) {
    if (abstraction.encoding.facet !== undefined) {
      delete abstraction.encoding.facet;
    }
  }

  return abstraction;
};

export function setSingleViewProperties(schema: any, abstraction: any) {
  if (schema.bounds !== undefined) {
    abstraction.bounds = JSON.parse(JSON.stringify(schema.bounds));
  }
  if (schema.spacing !== undefined) {
    abstraction.spacing = JSON.parse(JSON.stringify(schema.spacing));
  }
  if (schema.columns !== undefined) {
    abstraction.columns = JSON.parse(JSON.stringify(schema.columns));
  }
  if (schema.width !== undefined) {
    abstraction.width = JSON.parse(JSON.stringify(schema.width));
  }
  if (schema.height !== undefined) {
    abstraction.height = JSON.parse(JSON.stringify(schema.height));
  }
  if (schema.data !== undefined) {
    abstraction.data = JSON.parse(JSON.stringify(schema.data));
  }
  if (schema.datasets !== undefined) {
    abstraction.datasets = JSON.parse(JSON.stringify(schema.datasets));
  }
  if (schema.transform !== undefined) {
    abstraction.transform = JSON.parse(JSON.stringify(schema.transform));
  }
  if (schema.config !== undefined) {
    abstraction.config = JSON.parse(JSON.stringify(schema.config));
  }
  if (schema.resolve !== undefined) {
    abstraction.resolve = JSON.parse(JSON.stringify(schema.resolve));
  }

  return abstraction;
};

export function getJoinedDatasetsOfChildNodes(view: View): Datasets {
  const joinedDatasets: Datasets = {};

  const visualElements = view.getFlatHierarchy();
  const childDatasets = visualElements
    .map(d => d.datasets)
    .filter(d => d !== undefined && d !== null);

  childDatasets.forEach(datasets => {
    const datasetKeys = Object.keys(datasets);
    datasetKeys.forEach(datasetKey => {
      joinedDatasets[datasetKey] = datasets[datasetKey];
    });
  });

  return joinedDatasets;
};

export function getAllDatasetsInHierarchy(view: View) {
  const allDatasetsInHierarchy: Datasets = getJoinedDatasetsOfChildNodes(view);
  let rootView: View = view;

  // only get datasets that are direct ancestors of the view, as siblings are not relevant
  while (rootView.parent !== null) {
    rootView = rootView.parent;

    if (rootView.datasets) {
      Object.keys(rootView.datasets).forEach(key => {
        allDatasetsInHierarchy[key] = rootView.datasets[key];
      });
    }
  }

  return allDatasetsInHierarchy;
}

export function getAbstraction(schema: any): any {
  let abstraction: any = null;

  if (isAtomicSchema(schema)) {
    // atomic can either be content of a plot or repeat, indicated by the compositionpropety being
    // set to 'spec'
    abstraction = getAtomicAbstraction(schema);
  } else if (isOverlaySchema(schema)) {
    abstraction = getLayerAbstraction(schema);
  } else if (isRepeatSchema(schema)) {
    abstraction = getRepeatAbstraction(schema);
  } else if (isConcatenateSchema(schema)) {
    abstraction = getConcatAbstraction(schema);
  } else if (isFacetSchema(schema)) {
    if (isInlineFacetSchema(schema)) {
      abstraction = getAtomicAbstraction(schema);
    } else {
      abstraction = getFacetAbstraction(schema);
    }
  }

  abstraction = setSingleViewProperties(schema, abstraction);

  return abstraction;
};

export function setSchemaSize(schema: any, width: number, height: number) {
  if (isPlotSchema(schema)) {
    schema.width = width;
    schema.height = height;
  } else if (isConcatenateSchema(schema)) {
    schema.width = width;
    schema.height = height;
  } else if (isRepeatSchema(schema)) {
    schema.spec.width = width;
    schema.spec.height = height;
  } else if (isFacetSchema(schema)) {
    if (isInlineFacetSchema(schema)) {
      schema.width = width;
      schema.height = height;
    } else {
      schema.spec.width = width;
      schema.spec.height = height;
    }
  }

  return schema;
};