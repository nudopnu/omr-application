import { Chord, ChordType, RomanNumeral, RomanNumerals } from "../Chords/Chord";
import { AnyKeyPitch } from "../KeyPitch";
import { ModeType, ModeTypes } from "../Mode";
import { Note } from "../Note";
import { NoteGlyph } from "./Glyph";

export class KeySignature {

    intervals: number[];
    relativeMidis: number[];

    constructor(
        public key: AnyKeyPitch,
        public mode: ModeType = 'Ionian',
    ) {
        let intervals = [2, 2, 1, 2, 2, 2, 1];
        let offset = ModeTypes.indexOf(mode);
        this.intervals = [...intervals.slice(offset), ...intervals.slice(0, offset)];

        let tmp = 0;
        this.relativeMidis = [0, ...this.intervals.map(interval => (tmp += interval))];
    }

    toScale(octave: number, duration: number, notes = 8): Note[] {
        let tmp = 0;
        return [0,
            ...[...Array(notes - 1).keys()].map(idx => tmp += this.intervals[idx % 7])
        ].map(relativeMidi => ({
            midi: relativeMidi + octave * 12,
            duration: duration,
        } as Note));
    }

    getNote(midi: number, duration = 1, preferedAccidental: "FLAT" | "SHARP" = 'FLAT') {
        const pitch = midi % 12;
        let match = this.relativeMidis.indexOf(pitch);
        if (match !== -1) {
            return NoteGlyph.fromNote({ duration: duration, midi: midi } as Note);
        } else {
            return NoteGlyph.fromNote({ duration: duration, midi: midi } as Note, preferedAccidental);
        }
    }

    getChord(romanNumeral: RomanNumeral, type: ChordType, octave?: number): Chord {
        let intervals: number[] = [];
        const start = RomanNumerals.indexOf(romanNumeral);
        let tmp = this.relativeMidis[start];
        if (type === "triad") {
            [...Array(6).keys()].forEach(idx => {
                if (idx % 2 === 0) {
                    intervals.push(tmp);
                    tmp = 0;
                }
                tmp += this.intervals[(start + idx) % 7];
            });
        } else if (type === "seventh") {
            [...Array(8).keys()].forEach(idx => {
                if (idx % 2 === 0) {
                    intervals.push(tmp);
                    tmp = 0;
                }
                tmp += this.intervals[(start + idx) % 7];
            });
        }
        return new Chord(intervals, octave);
    }
}