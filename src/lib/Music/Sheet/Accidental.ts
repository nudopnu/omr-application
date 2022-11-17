export const Accidentals = [
    'DOUBLEFLAT',
    'FLAT',
    'NATURAL',
    'SHARP',
    'DOUBLESHARP',
] as const;

export type Accidental = typeof Accidentals[number];