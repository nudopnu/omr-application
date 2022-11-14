import { Note } from "../Note";
import { BarLineType } from "./BarLine";
import { Clef } from "./Clef";
import { DecorationType } from "./Decoration";
import { KeySignature } from "./KeySignature";

export const GlyphTypes = [
    'chord',
    'rest',
    'multi-measure-rest',
    'repeat',
    'barline',
    'key',
] as const;

export type GlyphType = typeof GlyphTypes[number];

export interface IGlyph {
    type: GlyphType;
}

export class ChordGlyph implements IGlyph {
    readonly type = 'chord';
    constructor(
        public notes: Note[],
        public duration: number = 1,
        public beam: ('start' | 'end' | 'middle' | null) = null,
        public ornament: DecorationType = "NONE",
    ) { }
}

export class RestGlyph implements IGlyph {
    readonly type = 'rest';
    constructor(
        public duration: number,
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

export type Glyph =
    | ChordGlyph
    | RestGlyph
    | BarLineGlyph
    | MultiMeasureRest
    | KeyGlyph
    ;