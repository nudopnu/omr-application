export const Clefs = [
    'treble',
    'bass',
    'alto',
] as const;

export type Clef = typeof Clefs[number];