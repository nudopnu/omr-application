import { ChordGlyph, NoteGlyph } from "../Sheet/Glyph";
import { KeySignature } from "../Sheet/KeySignature";

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

export type ChordType = typeof ChordTypes[number];
export type Triad = typeof TriadNames[number];
export type Seventh = typeof SeventhNames[number];
export type RomanNumeral = typeof RomanNumerals[number];

export class Chord {
    constructor(
        public intervals: number[],
        public octave?: number,
    ) { }

    toGlyph(key: KeySignature, arpeggiate?: boolean): ChordGlyph {
        let tmp = this.octave ? this.octave * 12 : 0;
        const relativePitches = this.intervals.map(interval => tmp += interval);
        const notes = relativePitches.map(relativePitch => key.getNote(relativePitch));
        return ChordGlyph.fromNotes(notes, arpeggiate);
    }
}