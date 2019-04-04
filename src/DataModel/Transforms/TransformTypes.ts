export type TransformName = 'aggregate' | 'bin' | 'calculate' | 'filter' | 'flatten' | 'fold' | 'impute'
  | 'join aggregate' | 'lookup' | 'sample' | 'stack' | 'time unit';

export const transformNames: TransformName[] = ['aggregate', 'bin', 'calculate', 'filter', 'flatten',
  'fold', 'impute', 'join aggregate', 'lookup', 'sample', 'stack', 'time unit'];