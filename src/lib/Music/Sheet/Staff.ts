import { Meter } from "../AbcUtils/Meter";
import { ChordGroup } from "./ChordGroup";
import { Clef } from "./Clef";
import { BarLineGlyph, ChordGlyph, Glyph, NoteGlyph } from "./Glyph";
import { KeySignature } from "./KeySignature";
import { Sheet } from "./Sheet";
import { StaffOptions } from "./StaffOptions";

export class Staff {

    public numberOfChords: number = 0;

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
        this.numberOfChords += notes.length;
    }

    splitNote(idx: number, durations: 'auto' | number[] = 'auto') {
        let counter = 0;
        let realidx = 0;
        console.log(this.glyphs, idx, this.numberOfChords);
        idx = (this.numberOfChords + idx) % this.numberOfChords;
        console.log(this.glyphs, idx);
        this.glyphs
            .forEach(glyph => {
                if (glyph.type === "chord") {
                    if (counter === idx) return
                    counter++;
                };
                realidx++;
            });

        const targetChord = this.glyphs[realidx] as ChordGlyph;

        let durationA = targetChord.duration - 1;
        let durationB = targetChord.duration - 1;

        if (durations !== 'auto' && durations.length === 2) {
            durationA = durations[0];
            durationB = durations[1];
        }

        this.glyphs = [
            ...this.glyphs.splice(0, realidx),
            { ...targetChord, duration: durationA, tie: "START" },
            new BarLineGlyph("SINGLE"),
            { ...targetChord, duration: durationB, tie: "END" },
            ...this.glyphs.splice(realidx + 1),
        ];
    }

    getNotes(): ChordGlyph[] {
        return this.glyphs.filter(glyph => glyph.type === "chord") as ChordGlyph[];
    }

    getNoteGroup(startIdx?: number, endIdx?: number): ChordGroup {
        return new ChordGroup(this.getNotes().slice(startIdx, endIdx));
    }

    addGlyphs(glyphs: Glyph[]) {
        this.glyphs.push(...glyphs);
        this.numberOfChords += this.glyphs
            .filter(glyph => glyph.type === "chord")
            .length;
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

    private ensureOptions() {
        if (!this.options)
            this.options = {};
    }
}