// Azerbaijani ordinal suffix for part numbers: 1-ci, 2-ci, 3-cü, 4-cü, 5-ci, 6-cı, 7-ci, 8-ci, 9-cu, 10-cu.
const SUFFIX: Record<number, string> = { 1: 'ci', 2: 'ci', 3: 'cü', 4: 'cü', 5: 'ci', 6: 'cı', 7: 'ci', 8: 'ci', 9: 'cu', 0: 'cu' };
export const ordinal = (n: number) => `${n}-${SUFFIX[n % 10] ?? 'ci'}`;
