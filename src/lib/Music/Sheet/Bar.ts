import { BarLineGlyph, GlyphWithDuration } from "./Glyph";
import { Staff } from "./Staff";

export const BarTypes = [
    "DEFAULT",
    "START",
    "END",
    "VOLTA_START",
    "SECTION_END",
    "REPEAT_START",
    "REPEAT_START_END",
    "REPEAT_END",
] as const;

export type BarType = typeof BarTypes[number];

export class Bar {
    constructor(
        public staff: Staff,
        public type: BarType = "DEFAULT",
        public containedGlyphs: GlyphWithDuration[] = [],
        public volta?: number,
    ) { }

    getStartGlyphs(): BarLineGlyph[] {
        if (this.type === "START") {
            return [new BarLineGlyph("START")];
        } else if (this.type === "VOLTA_START") {
            return [new BarLineGlyph("START")];
        } else if (this.type === "REPEAT_START" || this.type === "REPEAT_START_END") {
            return [new BarLineGlyph("REPEAT_START")];
        }
        return [];
    }

    getEndGlyphs(): BarLineGlyph[] {
        if (this.type === "END") {
            return [new BarLineGlyph("END")];
        } else if (this.type === "REPEAT_END" || this.type === "REPEAT_START_END") {
            return [new BarLineGlyph("REPEAT_END")];
        } else if (this.type === "SECTION_END") {
            return [new BarLineGlyph("DOUBLE")];
        }
        return [];
    }

}