export const BarLineTypes = [
    'SINGLE',
    'DOUBLE',
    'START',
    'END',
    'REPEAT_START',
    'REPEAT_END',
    'REPEAT_DOUBLE',
] as const;

export type BarLineType = typeof BarLineTypes[number];