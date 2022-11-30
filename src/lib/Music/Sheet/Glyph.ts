import { Optional } from "../../Optional";
import { Meter } from "../AbcUtils/Meter";
import { Note } from "../Note";
import { Accidental } from "./Accidental";
import { BarLineType } from "./BarLine";
import { Clef } from "./Clef";
import { DecorationType } from "./Decoration";
import { Dynamic } from "./Dynamics";
import { GraceNote, GraceNoteType } from "./GraceNote";
import { KeySignature } from "./KeySignature";
import { StyleType } from "./Style";

export const GlyphTypes = [
    'note',
    'chord',
    'rest',
    'multi-measure-rest',
    'repeat',
    'barline',
    'key',
    'meter',
    'n-tuplet',
] as const;

export type GlyphType = typeof GlyphTypes[number];

export const PartTypes = [
    'START',
    'MIDDLE',
    'END',
] as const;

export type PartType = typeof PartTypes[number];

export interface IGlyph {
    type: GlyphType;
}

export class NoteGlyph implements Note, IGlyph {
    readonly type = 'note';
    static fromMidi(midi: number, duration: number, forcedAccidental: Optional<Accidental> = undefined): NoteGlyph {
        return new NoteGlyph(midi, duration, forcedAccidental);
    }
    static fromMidis(midis: number[], durations: number[]): NoteGlyph[] {
        return midis.map((midi, idx) => this.fromMidi(midi, durations[idx]));
    }
    static fromNote(note: Note, forcedAccidental: Optional<Accidental> = undefined): NoteGlyph {
        return new NoteGlyph(note.midi, note.duration, forcedAccidental);
    }
    static fromNotes(notes: Note[]): NoteGlyph[] {
        return notes.map(note => this.fromNote(note));
    }
    private constructor(
        public midi: number,
        public duration: number,
        public accidental: Optional<Accidental> = undefined,
        public fingering: Optional<number> = undefined,
    ) { }
}

export class ChordGlyph implements IGlyph {
    readonly type = 'chord';

    constructor(
        public notes: NoteGlyph[],
        public duration: number = 1,
        public style: Optional<StyleType> = undefined,
        public graceNote: Optional<GraceNote> = undefined,
        public beam: Optional<PartType> = undefined,
        public dynamic: Optional<Dynamic> = undefined,
        public creshendo: Optional<PartType> = undefined,
        public diminuendo: Optional<PartType> = undefined,
        public slur: Optional<PartType> = undefined,
        public tie: Optional<PartType> = undefined,
        public ornaments: DecorationType[] = [],
        public startTuple: number = 0,
        public tremolo: number = 0,
        public arpeggiated: boolean = false,
        public punctuated: boolean = false,
    ) { }

    static fromNotes(notes: Note[], arpeggiate?: boolean, style?: StyleType): ChordGlyph {
        const noteGlpyhs: NoteGlyph[] = notes.map(note => NoteGlyph.fromNote(note));
        const chordGlyph = new ChordGlyph(noteGlpyhs, notes[0].duration, style);
        chordGlyph.arpeggiated = arpeggiate ? arpeggiate : false;
        return chordGlyph;
    }
}

export class RestGlyph implements IGlyph {
    readonly type = 'rest';
    constructor(
        public duration: number,
        public punctuated: boolean = false,
    ) { }
}

export class MultiMeasureRest implements IGlyph {
    readonly type = "multi-measure-rest";
    constructor(
        public duration: number | string,
    ) { }
}

export class BarLineGlyph implements IGlyph {
    readonly type = 'barline';
    constructor(
        public barLineType: BarLineType = "SINGLE",
        public explicit: boolean = true,
    ) { }
}

export class KeyGlyph implements IGlyph {
    readonly type = "key";
    constructor(
        public clef: Clef,
        public key: KeySignature,
    ) { }
}

export class MeterGlyph implements IGlyph {
    readonly type = "meter";
    constructor(
        public meter: Meter,
    ) { }
}

export type GlyphWithDuration =
    | RestGlyph
    | ChordGlyph
    ;

export type Glyph =
    | ChordGlyph
    | RestGlyph
    | BarLineGlyph
    | MultiMeasureRest
    | KeyGlyph
    | MeterGlyph
    ;