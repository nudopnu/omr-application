export const StyleTypes = [
    'NORMAL',
    'RYTHM',
    'HARMONIC',
    'X',
    'TRAINGLE',
] as const;

export type StyleType = typeof StyleTypes[number];