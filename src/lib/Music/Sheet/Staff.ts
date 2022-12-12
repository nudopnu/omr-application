import { BidirectionalMap } from "../../BidirectionalMap";
import { Meter } from "../AbcUtils/Meter";
import { Bar, BarType } from "./Bar";
import { ChordGroup } from "./ChordGroup";
import { Clef } from "./Clef";
import { Duration } from "./Duration";
import { BarLineGlyph, ChordGlyph, Glyph, GlyphWithDuration, NoteGlyph, RestGlyph } from "./Glyph";
import { KeySignature } from "./KeySignature";
import { Sheet } from "./Sheet";
import { StaffOptions } from "./StaffOptions";
import { StyleType } from "./Style";

export class Staff {

    private durationGlyphIdxMap: BidirectionalMap<number, GlyphWithDuration> = new BidirectionalMap();
    glyphs: Glyph[] = [];

    constructor(
        public sheet: Sheet,
        public options?: StaffOptions,
        public bars: Bar[] = [],
    ) {
        if (bars.length === 0) {
            bars.push(new Bar(this, "DEFAULT"));
        } else {
            bars.forEach((bar, idx) => {
                this.addGlyphs(bar.getStartGlyphs());
                if (idx !== bars.length - 1) {
                    this.addGlyphs(bar.getEndGlyphs());
                }
            });
        }
    }

    indexOf(glyph: GlyphWithDuration): number {
        return this.durationGlyphIdxMap.getKey(glyph)!;
    }

    getNext(glyph: GlyphWithDuration): GlyphWithDuration {
        return this.durationGlyphIdxMap.getValue(this.indexOf(glyph) + 1)!;
    }

    getPrevious(glyph: GlyphWithDuration): GlyphWithDuration {
        return this.durationGlyphIdxMap.getValue(this.indexOf(glyph) - 1)!;
    }

    addNotes(notes: NoteGlyph[], duration?: number, style?: StyleType) {
        duration = duration ? duration : this.sheet.options.defaultDuration;
        const chordGlyphs = notes.map(note => new ChordGlyph([note], note.duration, style));
        this.addChordGlyphs(chordGlyphs);
    }

    addRests(durations: number[]) {
        const restGlyphs = durations.map(duration => new RestGlyph(duration));
        this.glyphs.push(
            ...restGlyphs
        );
        this.updateDurationGlyphsMap();
    }

    addChordGlyphs(chordGlyphs: ChordGlyph[]) {
        this.glyphs.push(
            ...chordGlyphs
        );
        this.updateDurationGlyphsMap();
    }

    startNextBar(type: BarType = "DEFAULT"): Bar {
        const lastBar = this.bars[this.bars.length - 1];
        const newBar = new Bar(this, type);
        this.bars.push(newBar);
        this.addGlyphs(lastBar.getEndGlyphs());
        this.addGlyphs(newBar.getStartGlyphs());
        return newBar;
    }

    applyBars(isLastInSheet = false): void {
        const lastBar = this.bars[this.bars.length - 1];
        console.log(lastBar, lastBar.getEndGlyphs());

        this.addGlyphs(lastBar.getEndGlyphs());
    }

    splitEven(chord: GlyphWithDuration, tie = false) {
        const idx = this.indexOf(chord);
        console.log(this.durationGlyphIdxMap, idx);

        let durationA = chord.duration - 1;
        let durationB = chord.duration - 1;

        const cloneA = chord.clone();
        cloneA.duration = durationA;

        const cloneB = chord.clone();
        cloneB.duration = durationB;

        if (tie && chord.type === "chord") {
            (cloneA as ChordGlyph).tie = "START";
            (cloneB as ChordGlyph).tie = "END";
        }

        const newGlyphs: Glyph[] = [
            cloneA,
            new BarLineGlyph("SINGLE"),
            cloneB,
        ];

        this.modifyAtIdx('replace', idx, newGlyphs);
    }

    splitToTriplet(chord: ChordGlyph) {
        let idx = this.indexOf(chord)
        let duration = Duration.modify(chord.duration, -1);

        const cloneA = chord.clone();
        cloneA.duration = duration;
        cloneA.beam = "MIDDLE";

        const cloneB = chord.clone();
        cloneB.duration = duration;
        cloneB.beam = "END";

        chord.startTuple = 3;
        chord.duration = duration;

        if (chord.slur === "END") {
            chord.slur = undefined;
            cloneB.slur = "END";
        }

        if (chord.notes.length >= 3) {
            chord.notes = [chord.notes[0]];
            cloneA.notes = [cloneA.notes[1]];
            cloneB.notes = [cloneB.notes[2]];
        }

        const newGlyphs: Glyph[] = [
            chord,
            cloneA,
            cloneB,
        ];

        this.modifyAtIdx('replace', idx, newGlyphs);
    }

    splitToPunctuation(chord: GlyphWithDuration) {
        let idx = this.indexOf(chord)
        const clone = chord.clone();
        clone.duration = Duration.modify(clone.duration, -1);
        chord.duration = Duration.modify(chord.duration, -1);
        chord.punctuated = true;

        const newGlyphs: Glyph[] = [
            chord,
            clone,
        ];

        this.modifyAtIdx('replace', idx, newGlyphs);
        console.log(this.glyphs);
        
    }

    modifyAtIdx(operation: 'delete' | 'replace' | 'prepend' | 'append', idx: number, glyphs: Glyph[] = []) {
        const preceedingGlyphs = this.glyphs.slice(0, idx);
        const targetGlyph = this.glyphs[idx];
        const followingGlyphs = this.glyphs.slice(idx + 1);

        if (operation === 'replace' || operation === 'delete') {
            this.glyphs = [
                ...preceedingGlyphs,
                ...glyphs,
                ...followingGlyphs,
            ];
        } else if (operation === 'append') {
            this.glyphs = [
                ...preceedingGlyphs,
                targetGlyph,
                ...glyphs,
                ...followingGlyphs,
            ];
        } else if (operation === 'prepend') {
            this.glyphs = [
                ...preceedingGlyphs,
                ...glyphs,
                targetGlyph,
                ...followingGlyphs,
            ];
        }
        this.updateDurationGlyphsMap();
    }

    getNotes(): ChordGlyph[] {
        return this.glyphs.filter(glyph => glyph.type === "chord") as ChordGlyph[];
    }

    getSuccessiveChords(minNumOfNotes?: number): ChordGlyph[][] {
        let res: ChordGlyph[][] = [[]];
        this.glyphs.forEach(glyph => {
            if (glyph.type !== "chord") {
                if (res[res.length - 1].length > 0)
                    res.push([]);
            } else {
                res[res.length - 1].push(glyph);
            }
        })
        if (res[res.length - 1].length === 0)
            res = res.slice(0, res.length - 2);
        if (minNumOfNotes) {
            res = res.filter(group => group.length >= minNumOfNotes);
        }
        console.log(res);
        return res;
    }

    getNoteGroup(startIdx?: number, endIdx?: number): ChordGroup {
        return new ChordGroup(this.getNotes().slice(startIdx, endIdx));
    }

    addGlyphs(glyphs: Glyph[]) {
        this.glyphs.push(...glyphs);
        this.updateDurationGlyphsMap();
    }

    private updateDurationGlyphsMap() {
        const previousIdcs = this.durationGlyphIdxMap.keys();
        const newIdcs: number[] = [];
        this.durationGlyphIdxMap.reset();
        this.glyphs.forEach((glyph, idx) => {
            if (glyph.type === "chord" || glyph.type === "rest") {
                this.durationGlyphIdxMap.set(idx, glyph);
                if (previousIdcs.indexOf(idx) !== -1) {
                    newIdcs.push(idx);
                }
            }
        });
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

    setStyle(style: StyleType) {
        this.ensureOptions();
        this.options!.style = style;
    }

    private ensureOptions() {
        if (!this.options)
            this.options = {};
    }
}