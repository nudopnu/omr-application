import { BidirectionalMap } from "../../BidirectionalMap";
import { Meter } from "../AbcUtils/Meter";
import { Bar, BarType } from "./Bar";
import { ChordGroup } from "./ChordGroup";
import { Clef } from "./Clef";
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

    splitNote(idx: number, durations: 'auto' | number[] = 'auto') {
        const chordIdcs = this.durationGlyphIdxMap.keys();
        chordIdcs.sort();
        idx = (idx + chordIdcs.length) % chordIdcs.length
        const realIdx = chordIdcs[idx];
        const targetChord = this.glyphs[realIdx] as ChordGlyph;
        console.log(chordIdcs, realIdx);


        let durationA = targetChord.duration - 1;
        let durationB = targetChord.duration - 1;

        if (durations !== 'auto' && durations.length === 2) {
            durationA = durations[0];
            durationB = durations[1];
        }

        const newGlyphs: Glyph[] = [
            { ...targetChord, duration: durationA, tie: "START" },
            new BarLineGlyph("SINGLE"),
            { ...targetChord, duration: durationB, tie: "END" }
        ];

        this.modifyAtIdx('replace', realIdx, newGlyphs);
    }

    modifyAtIdx(operation: 'delete' | 'replace' | 'prepend' | 'append', idx: number, glyphs: Glyph[] = []) {
        const preceedingGlyphs = this.glyphs.splice(0, idx);
        const targetGlyph = this.glyphs[idx];
        const followingGlyphs = this.glyphs.splice(idx + 1);

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