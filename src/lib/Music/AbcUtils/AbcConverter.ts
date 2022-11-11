import { AnyGlyph, Glyph } from "../Sheet/Glyph";
import { KeySignature } from "../Sheet/KeySignature";
import { Sheet } from "../Sheet/Sheet";
import { AbcPitches } from "./AbcPitches";

export class AbcConverter {
    static fromSheet(sheet: Sheet): string {
        let res = "X:1\n";

        const systemType = sheet.options.systemType;
        const key = sheet.options.key;
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

        sheet.systems.forEach(system => {
            system.staffs.forEach(staff => {
                staff.glyphs.forEach(glyph => {
                    res += this.glyphToString(glyph, key);
                })
                res += "\n";
            })
        })

        return res;
    }

    static glyphToString(glyph: AnyGlyph, key: KeySignature): string {
        let res = "";
        if (glyph.type === "chord") {
            glyph.notes.forEach(note => {
                let pitch = note.midi % 12
                let octave = (note.midi - pitch) / 12;

                let match = key.relativeMidis.indexOf(pitch);
                console.log(key.relativeMidis, pitch);

                if (match !== -1) {
                    res += AbcPitches[match];
                }

                if (octave < 5) res += ",".repeat(5 - octave);
                if (octave > 5) res += "'".repeat(octave - 5);
            })
            if (glyph.notes.length > 1) {
                res = `[${res}]`;
            }
            res += glyph.duration;
        }
        return res
    }

    private constructor() { }
}