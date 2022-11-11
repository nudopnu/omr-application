import { Note } from "../Note";
import { AnyGlyph, Chord } from "./Glyph";
import { Sheet } from "./Sheet";
import { StaffOptions } from "./StaffOptions";

export class Staff {
    constructor(
        public sheet: Sheet,
        public glyphs: AnyGlyph[] = [],
        public options?: StaffOptions,
    ) { }

    addNotes(notes: Note[]) {
        this.glyphs.push(
            ...notes
                .map(note => new Chord([note], this.sheet.options.defaultDuration))
        )
    }

    addGlyphs(glyphs: AnyGlyph[]) {
        this.glyphs.push(...glyphs);
    }
}