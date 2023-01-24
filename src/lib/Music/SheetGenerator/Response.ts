export const ResponseGlyphTypes = ["RestWhole",
"RestHalf",
"RestQuarter",
"Rest8th",
"ClefG",
"ClefF",
"black",
"half",
] as const;

export type ResponseGlyphType = typeof ResponseGlyphTypes[number];

export interface DefaultResponseGlyph {
    type: ResponseGlyphType;
    staff: string | number;
    x: string | number;
}

export interface ResponseNoteGlyph extends DefaultResponseGlyph {
    pitches: number[];
    beamgroup: number;
}

export type ResponseGlyph = DefaultResponseGlyph
    | ResponseNoteGlyph;