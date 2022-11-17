import { Meter } from "../AbcUtils/Meter";
import { ChordGroup } from "./ChordGroup";
import { Clef } from "./Clef";
import { ChordGlyph, Glyph, NoteGlyph } from "./Glyph";
import { KeySignature } from "./KeySignature";
import { Sheet } from "./Sheet";
import { StaffOptions } from "./StaffOptions";

export class Staff {
    constructor(
        public sheet: Sheet,
        public glyphs: Glyph[] = [],
        public options?: StaffOptions,
    ) { }

    addNotes(notes: NoteGlyph[], duration?: number) {
        duration = duration ? duration : this.sheet.options.defaultDuration;
        this.glyphs.push(
            ...notes
                .map(note => new ChordGlyph([note], note.duration))
        )
    }

    getNotes(): ChordGlyph[] {
        return this.glyphs.filter(glyph => glyph.type === "chord") as ChordGlyph[];
    }

    getNoteGroup(startIdx: number, endIdx: number): ChordGroup {
        return new ChordGroup(this.getNotes().slice(startIdx, endIdx));
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