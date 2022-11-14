export const Clefs = [
    'treble',
    'treble-8',
    'bass',
    'bass3',
    'bass-8',
    'alto',
    'alto1',
    'alto2',
    'tenor',
] as const;

export type Clef = typeof Clefs[number];