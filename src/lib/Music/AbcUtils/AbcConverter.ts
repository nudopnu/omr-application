import { ChordGlyph, Glyph } from "../Sheet/Glyph";
import { KeySignature } from "../Sheet/KeySignature";
import { Sheet } from "../Sheet/Sheet";
import { SheetOptions } from "../Sheet/SheetOptions";
import { AbcStrings } from "./AbcStrings";

export class AbcConverter {
    static fromSheet(sheet: Sheet): string {

        /* Add Sheet Headers */
        let res = "X:1\n";
        const { systemType, meter } = sheet.options;
        if (systemType) {
            switch (systemType) {
                case "grand-staff":
                    res += "%%score { V1 V2";
                    res += "V: V1 clef=treble";
                    res += "V: V2 clef=bass";
                    break;
                default:
                    break;
            }
        }
        if (meter) {
            res += `M:${meter.toAbcString()}\n`;
        }

        /* Process sheet content */
        sheet.systems.forEach(system => {
            system.staffs.forEach(staff => {
                if (staff.options) {
                    const { clef, key, meter } = staff.options;
                    if (clef || key || meter) {
                        res += ","
                        if (meter) res += `[M: ${meter.toAbcString()}]`;
                        if (key) {
                            res += `[K:${key.key} ${key.mode}`;
                            if (clef) res += ` clef=${clef}`;
                            res += "]\n";
                        }
                    }
                }
                staff.glyphs.forEach(glyph => {
                    res += this.glyphToString(glyph, sheet.options);
                })
                res += "\n";
            })
        })

        return res;
    }

    static glyphToString(glyph: Glyph, sheetOptions: SheetOptions): string {
        const { key } = sheetOptions;
        let res = "";
        if (glyph.type === "chord") {
            res += this.chordToString(glyph, key);
            res += this.durationToString(glyph.duration);
        }
        else if (glyph.type === "rest") {
            res += " z";
            res += this.durationToString(glyph.duration);
        }
        else if (glyph.type === "multi-measure-rest") {
            res += " Z" + glyph.duration;
        }
        else if (glyph.type === "barline" && glyph.explicit) {
            res += AbcStrings.Barline[glyph.barLineType];
        }
        else if (glyph.type === "key") {
            res += ` [K:${glyph.key.key} ${glyph.key.mode} clef=${glyph.clef}] `
        }
        return res
    }

    static chordToString(glyph: ChordGlyph, key: KeySignature) {
        let res = "";

        /* Put whitespace if not connected to previous */
        if (glyph.beam === null || glyph.beam === "start") res += " ";

        /* Add Ornament */
        res += AbcStrings.Accent[glyph.ornament];

        /* Process notes */
        glyph.notes.forEach(note => {
            let pitch = note.midi % 12;
            let octave = (note.midi - pitch) / 12;

            /* Match pitch of note to key signature */
            let match = key.relativeMidis.indexOf(pitch);
            if (match !== -1) {
                res += AbcStrings.Pitches[match];
            }

            /* Shift note according to its octave */
            if (octave < 5)
                res += ",".repeat(5 - octave);
            if (octave > 5)
                res += "'".repeat(octave - 5);
        });

        /* Wrap into a chord if multiple notes present */
        if (glyph.notes.length > 1) {
            res = `[${res}]`;
        }

        return res;
    }

    static durationToString(duration: number): string {
        if (duration < 1) return "1/" + Math.pow(2, -duration)
        if (duration > 1) return Math.pow(2, duration - 1) + "";
        return "";
    }

    private constructor() { }
}