export const PitchClassesFlat = [
    'C',
    'Db',
    'D',
    'Eb',
    'E',
    'F',
    'Gb',
    'G',
    'Ab',
    'A',
    'Bb',
    'B',
] as const;

export const PitchClassesSharp = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
] as const;

export const PitchClasses = [
    ...PitchClassesFlat,
    ...PitchClassesSharp,
] as const;

export type PitchClass = typeof PitchClasses[number];