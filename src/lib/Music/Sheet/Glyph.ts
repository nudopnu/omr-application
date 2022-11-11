import { Note } from "../Note";

export const GlyphTypes = [
    'chord',
    'rest',
] as const;

export type GlyphType = typeof GlyphTypes[number];

export interface Glyph {
    type: GlyphType;
}

export class Chord implements Glyph {
    readonly type = 'chord';
    constructor(
        public notes: Note[],
        public duration: number = 1,
        public beam: ('start' | 'end' | 'middle' | null) = null,
    ) { }
}

export class Rest implements Glyph {
    readonly type = 'rest';
    constructor(
        public duration: number,
    ) { }
}

export type AnyGlyph =
    | Chord
    | Rest
    ;