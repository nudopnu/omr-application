import { Note } from "../Note";
import { Clef } from "./Clef";
import { KeySignature } from "./KeySignature";

export const GlyphTypes = [
    'chord',
    'rest',
    'repeat',
    'barline',
    'key',
] as const;

export type GlyphType = typeof GlyphTypes[number];

export interface IGlyph {
    type: GlyphType;
}

export class Chord implements IGlyph {
    readonly type = 'chord';
    constructor(
        public notes: Note[],
        public duration: number = 1,
        public beam: ('start' | 'end' | 'middle' | null) = null,
    ) { }
}

export class Rest implements IGlyph {
    readonly type = 'rest';
    constructor(
        public duration: number,
    ) { }
}

export class Repeat implements IGlyph {
    readonly type = 'repeat';
    constructor(
        public isStart: boolean = true,
    ) { }
}

export class BarLine implements IGlyph {
    readonly type = 'barline';
    constructor(
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

export type Glyph =
    | Chord
    | Rest
    | Repeat
    | BarLine
    | KeyGlyph
    ;