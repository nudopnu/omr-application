import { AnyGlyph } from "../Sheet/Glyph";
import { KeySignature } from "../Sheet/KeySignature";
import { Sheet } from "../Sheet/Sheet";
import { SheetOptions } from "../Sheet/SheetOptions";
import { AbcPitches } from "./AbcPitches";

export class AbcConverter {
    static fromSheet(sheet: Sheet): string {
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

        sheet.systems.forEach(system => {
            system.staffs.forEach(staff => {
                staff.glyphs.forEach(glyph => {
                    res += this.glyphToString(glyph, sheet.options);
                })
                res += "\n";
            })
        })

        return res;
    }

    static glyphToString(glyph: AnyGlyph, sheetOptions: SheetOptions): string {
        const { key, unitNoteLength } = sheetOptions;
        let res = "";
        if (glyph.type === "chord") {
            if (glyph.beam === null || glyph.beam === "start") res += " ";
            glyph.notes.forEach(note => {
                let pitch = note.midi % 12
                let octave = (note.midi - pitch) / 12;

                let match = key.relativeMidis.indexOf(pitch);

                if (match !== -1) {
                    res += AbcPitches[match];
                }

                if (octave < 5) res += ",".repeat(5 - octave);
                if (octave > 5) res += "'".repeat(octave - 5);
            })
            if (glyph.notes.length > 1) {
                res = `[${res}]`;
            }
            res += this.durationToString(glyph.duration);
        }
        if (glyph.type === "rest") {
            res += "z";
            res += this.durationToString(glyph.duration);
        }
        return res
    }

    static durationToString(duration: number): string {
        if (duration < 1) return "1/" + Math.pow(2, -duration)
        if (duration > 1) return Math.pow(2, duration - 1) + "";
        return "";
    }

    private constructor() { }
}