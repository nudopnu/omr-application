export const BarLineTypes = [
    'single',
    'double',
    'start',
    'end',
    'repeat-start',
    'repeat-end',
    'repeat-double',
] as const;

export type BarLineType = typeof BarLineTypes[number];