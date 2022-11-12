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

    addNotes(notes: Note[], duration?: number) {
        duration = duration ? duration : this.sheet.options.defaultDuration;
        this.glyphs.push(
            ...notes
                .map(note => new Chord([note], note.duration))
        )
    }

    addGlyphs(glyphs: AnyGlyph[]) {
        this.glyphs.push(...glyphs);
    }
}