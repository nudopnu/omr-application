export const CircleOfFifthsSharps = [
    'C',
    'G',
    'D',
    'A',
    'E',
    'B',
    'F#',
    'C#',
] as const;

export const CircleOfFifthsFlats = [
    'F',
    'Bb',
    'Eb',
    'Ab',
    'Db',
    'Gb',
    'Cb',
] as const;

export const KeyPitches = [
    ...CircleOfFifthsSharps,
    ...CircleOfFifthsFlats,
] as const;

export type AnyKeyPitch = typeof KeyPitches[number];