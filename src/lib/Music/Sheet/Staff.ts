import { Meter } from "../AbcUtils/Meter";
import { Note } from "../Note";
import { Clef } from "./Clef";
import { Glyph, Chord } from "./Glyph";
import { KeySignature } from "./KeySignature";
import { Sheet } from "./Sheet";
import { StaffOptions } from "./StaffOptions";

export class Staff {
    constructor(
        public sheet: Sheet,
        public glyphs: Glyph[] = [],
        public options?: StaffOptions,
    ) { }

    addNotes(notes: Note[], duration?: number) {
        duration = duration ? duration : this.sheet.options.defaultDuration;
        this.glyphs.push(
            ...notes
                .map(note => new Chord([note], note.duration))
        )
    }

    addGlyphs(glyphs: Glyph[]) {
        this.glyphs.push(...glyphs);
    }

    private ensureOptions() {
        if (!this.options)
            this.options = {};
    }

    setClef(clef: Clef) {
        this.ensureOptions();
        this.options!.clef = clef;
    }

    setKey(key: KeySignature) {
        this.ensureOptions();
        this.options!.key = key;
    }

    setMeter(meter: Meter) {
        this.ensureOptions();
        this.options!.meter = meter;
    }

}