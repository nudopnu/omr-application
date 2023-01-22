export interface DefaultResponseGlyph {
    type: string;
    staff: string | number;
    x: string | number;
}

export interface ResponseNoteGlyph extends DefaultResponseGlyph {
    pitches: number[];
    beamgroup: string | number;
}

export type ResponseGlyph = DefaultResponseGlyph
    | ResponseNoteGlyph;