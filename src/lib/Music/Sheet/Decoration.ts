export const DecorationTypes = [
    'NONE',
    'STACCATO',
    'FERMATA',
    'FERMATA_INVERTED',
    'CODA',
    'SEGNO',
    'TRILL',
    'BOW_UP',
    'BOW_DOWN',
    'ACCENT',
    'TENUTO',
    'BREATH',
] as const;

export type DecorationType = typeof DecorationTypes[number];