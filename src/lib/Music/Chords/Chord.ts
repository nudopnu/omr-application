export const TriadNames = [
    'm',
    'M',
    'dim',
    'aug',
] as const;

export const SeventhNames = [
    'm7',
    'M7',
    '7',
    '7',
] as const;

export const RomanNumerals = [
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
] as const;

export type Triad = typeof TriadNames[number];
export type RomanNumeral = typeof RomanNumerals[number];