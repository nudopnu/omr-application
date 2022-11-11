export const Accidentals = [
    'doubleflat',
    'flat',
    'natural',
    'sharp',
    'doublesharp',
] as const;

export type Accidental = typeof Accidentals[number];