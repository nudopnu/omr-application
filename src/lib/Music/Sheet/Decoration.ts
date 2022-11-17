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
    'ROLL',
    'PRALLTRILLER',
    'MORDENT',
    'TURN',
    'SLIDE',
] as const;

export type DecorationType = typeof DecorationTypes[number];