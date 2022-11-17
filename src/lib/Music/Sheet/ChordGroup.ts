import { ChordGlyph } from "./Glyph";

export class ChordGroup {
    constructor(
        public innerNotes: ChordGlyph[],
        public enclosed: boolean = false,
    ) { }

    beam(connect: boolean = true) {
        if (connect) {
            this.innerNotes
                .slice(1, this.innerNotes.length - 1)
                .forEach(note => note.beam = "middle");
            this.innerNotes[0].beam = "start";
            this.innerNotes[this.innerNotes.length - 1].beam = "end";
        } else {
            this.innerNotes
                .forEach(note => note.beam = null);
        }
    }

    nTuplet(connect: boolean = true) {
        if (connect) {
            this.innerNotes[0].startTuple = this.innerNotes.length;
        } else {
            this.innerNotes[0].startTuple = 0;
        }
    }

    forEach(callback: (note: ChordGlyph) => void) {
        this.innerNotes.forEach(callback);
    }
}