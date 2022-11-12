export const Clefs = [
    'treble',
    'treble-8',
    'bass',
    'bass-8',
    'alto',
] as const;

export type Clef = typeof Clefs[number];