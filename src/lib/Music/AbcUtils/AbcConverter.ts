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
            res += this.durationToString(glyph.duration, glyph.punctuated);
        }
        else if (glyph.type === "rest") {
            res += " z";
            res += this.durationToString(glyph.duration, glyph.punctuated);
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
        let fingering = "";

        /* Put whitespace if not connected to previous */
        if (glyph.beam == null || glyph.beam === "START") res += " ";

        /* Add Creshendo / Diminuendo */
        if (glyph.creshendo === "START") res += `!${AbcStrings.Creshendo.START}!`;
        if (glyph.creshendo === "END") res += `!${AbcStrings.Creshendo.END}!`;
        if (glyph.diminuendo === "START") res += `!${AbcStrings.Diminuendo.START}!`;
        if (glyph.diminuendo === "END") res += `!${AbcStrings.Diminuendo.END}!`;

        /* Add Slur / Tie */
        if (glyph.slur === "START") res += AbcStrings.Slur.START;
        if (glyph.tie === "END") res += AbcStrings.TIE;

        /* Add Tuple */
        if (glyph.startTuple > 1) res += `(${glyph.startTuple})`;

        /* Add Ornaments */
        glyph.ornaments.forEach(ornament => res += AbcStrings.Accent[ornament]);
        if (glyph.dynamic) res += `!${glyph.dynamic}!`;
        if (glyph.tremolo) res += `!${AbcStrings.Tremolo[glyph.tremolo]}!`;

        /* Process notes */
        glyph.notes.forEach(note => {
            let pitch = note.midi % 12;
            let octave = (note.midi - pitch) / 12;

            /* Prepend enforced accidental if present */
            if (note.accidental) {
                res += AbcStrings.Accidental[note.accidental];
            }

            /* Match pitch of note to key signature */
            let match = key.relativeMidis.indexOf(pitch);
            if (match !== -1) {
                res += AbcStrings.Pitches[match];
            }

            //TODO: automatically add accidentals

            /* Shift note according to its octave */
            if (octave < 5)
                res += AbcStrings.Octave.LOWER.repeat(5 - octave);
            if (octave > 5)
                res += AbcStrings.Octave.HIGHER.repeat(octave - 5);
        });

        /* Wrap into a chord if multiple notes present */
        if (glyph.notes.length > 1) {
            res = `[${res}]`;
        }

        /* Add Slur / Tie */
        if (glyph.slur === "END") res += AbcStrings.Slur.END;
        if (glyph.tie === "START") res += AbcStrings.TIE;

        return res;
    }

    static durationToString(duration: number, punctuated: boolean): string {
        if (duration < 1) return "1/" + (Math.pow(2, -duration) + (punctuated ? Math.pow(2, -duration - 1) : 0))
        if (duration > 1) return (Math.pow(2, duration - 1) + (punctuated ? Math.pow(2, duration - 2) : 0)) + "";
        return "";
    }

    private constructor() { }
}