import { RomanNumeral } from "./Chord";

export const ChordProgressionTypes = [
    'ANDALUSIAN_CADENCE',
] as const;

export type ChordProgressionType = typeof ChordProgressionTypes[number];

export type ChordPropegressionIntervalsMap = { [key in ChordProgressionType]: RomanNumeral[] };

export const ChordProgressionIntervals: ChordPropegressionIntervalsMap = {
    ANDALUSIAN_CADENCE: ["I", "VII", "VI", "V"],
};