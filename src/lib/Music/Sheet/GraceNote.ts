import { NoteGlyph } from "./Glyph";

export const GraceNoteTypes = [
    'ACCIACCATURA',
    'APPOGGIATURA',
] as const;

export type GraceNoteType = typeof GraceNoteTypes[number];

export class GraceNote {
    constructor(
        public type: GraceNoteType,
        public note: NoteGlyph,
    ) { }
}