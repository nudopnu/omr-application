import { ChordGlyph } from "../Sheet/Glyph";
import { KeySignature } from "../Sheet/KeySignature";
import { StyleType } from "../Sheet/Style";

export const ChordTypes = [
    'triad',
    'seventh',
] as const;

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
    'dim7',
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

export type ChordType = typeof ChordTypes[number];
export type Triad = typeof TriadNames[number];
export type Seventh = typeof SeventhNames[number];
export type RomanNumeral = typeof RomanNumerals[number];

export class Chord {
    constructor(
        public intervals: number[],
        public octave?: number,
        public inversion = 0,
    ) { }

    toGlyph(key: KeySignature, arpeggiate?: boolean, duration: number = 1, style?: StyleType): ChordGlyph {
        let tmp = this.octave ? this.octave * 12 : 0;
        const relativePitches = this.intervals.map(interval => tmp += interval);
        [...Array(this.inversion).keys()].forEach(i => relativePitches[i] += 12);
        const notes = relativePitches.map(relativePitch => key.getNote(relativePitch, duration));
        return ChordGlyph.fromNotes(notes, arpeggiate, style);
    }
}