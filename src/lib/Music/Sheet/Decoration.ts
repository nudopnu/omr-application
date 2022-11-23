export const DecorationTypes = [
    'NONE',
    'ARPEGGIO',
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
    'MARCATO',
    'STACCATISSIMO',
] as const;

export type DecorationType = typeof DecorationTypes[number];