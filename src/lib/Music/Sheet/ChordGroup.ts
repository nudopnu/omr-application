import { ChordGlyph } from "./Glyph";

export class ChordGroup {

    constructor(
        public innerNotes: ChordGlyph[],
        public enclosed: boolean = false,
    ) { }

    static fromChordGlyph(chordGlyph: ChordGlyph, times: number, method: 'repeat', map?: (chord: ChordGlyph, idx: number) => ChordGlyph): ChordGroup {
        if (method === "repeat") {
            let copies = [...Array(times).keys()].map(_ => ({ ...chordGlyph }) as ChordGlyph)
            if (map) {
                copies = copies.map(map);
            }
            return new ChordGroup(copies);
        }
        return new ChordGroup([chordGlyph]);
    }

    beam(connect: boolean = true) {
        if (connect) {
            this.innerNotes
                .slice(1, this.innerNotes.length - 1)
                .forEach(note => note.beam = "MIDDLE");
            this.innerNotes[0].beam = "START";
            this.innerNotes[this.innerNotes.length - 1].beam = "END";
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

    creshendo(apply: boolean = true) {
        if (apply) {
            this.innerNotes[0].creshendo = "START";
            this.innerNotes[this.innerNotes.length - 1].creshendo = "END";
        } else {
            this.innerNotes.forEach(note => note.creshendo = null);
        }
    }

    diminuendo(apply: boolean = true) {
        if (apply) {
            this.innerNotes[0].diminuendo = "START";
            this.innerNotes[this.innerNotes.length - 1].diminuendo = "END";
        } else {
            this.innerNotes.forEach(note => note.diminuendo = null);
        }
    }

    slur(apply: boolean = true) {
        if (apply) {
            this.innerNotes[0].slur = "START";
            this.innerNotes[this.innerNotes.length - 1].slur = "END";
        } else {
            this.innerNotes.forEach(note => note.slur = null);
        }
    }

    forEach(callback: (note: ChordGlyph) => void) {
        this.innerNotes.forEach(callback);
    }
}