import { ChordGlyph, Glyph, NoteGlyph } from "../Sheet/Glyph";
import { KeySignature } from "../Sheet/KeySignature";
import { Sheet } from "../Sheet/Sheet";
import { SheetOptions } from "../Sheet/SheetOptions";
import { AbcStrings } from "./AbcStrings";

export class AbcConverter {
    static fromSheet(sheet: Sheet): string {

        /* Add Sheet Headers */
        let res = "X:1\n";
        let multiStaff = false;
        const { systemType, meter } = sheet.options;
        if (systemType) {
            switch (systemType) {
                case "grand-staff":
                    res += "%%score { V1 V2 }\n";
                    res += "V: V1 clef=treble\n";
                    res += "V: V2 clef=bass\n";
                    multiStaff = true;
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
            system.staffs.forEach((staff, idx) => {
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
                if (multiStaff) res += `[V:V${idx + 1}]\n`;
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
        else if (glyph.type === "void") {
            res += ` x`
            res += this.durationToString(glyph.duration, false);
        }
        return res
    }

    static chordToString(glyph: ChordGlyph, key: KeySignature, isGrace = false) {
        let res = "";

        /* Prepend Grace Notes if present */
        if (glyph.graceNote != null) {
            const graceString = AbcConverter.noteToString(glyph.graceNote.note!, key);
            if (glyph.graceNote.type === "ACCIACCATURA") {
                res += `{${graceString}}`;
            } else {
                res += `{/${graceString}}`;
            }
        }

        /* Add Creshendo / Diminuendo */
        if (glyph.creshendo === "START") res += `!${AbcStrings.Creshendo.START}!`;
        if (glyph.creshendo === "END") res += `!${AbcStrings.Creshendo.END}!`;
        if (glyph.diminuendo === "START") res += `!${AbcStrings.Diminuendo.START}!`;
        if (glyph.diminuendo === "END") res += `!${AbcStrings.Diminuendo.END}!`;

        /* Add Ornaments */
        glyph.ornaments.forEach(ornament => res += AbcStrings.Accent[ornament]);
        if (glyph.dynamic) res += `!${glyph.dynamic}!`;
        if (glyph.tremolo) res += `!${AbcStrings.Tremolo[glyph.tremolo]}!`;
        if (glyph.style) res += `!${AbcStrings.Styles[glyph.style]}!`;

        /* Process notes */
        glyph.notes.forEach(note => {
            res += AbcConverter.noteToString(note, key);
        });

        /* Wrap into a chord if multiple notes present */
        if (glyph.notes.length > 1) {
            res = `[${res}]`;
            if (glyph.arpeggiated) {
                res = AbcStrings.Accent["ARPEGGIO"] + res;
            }
        }

        /* Add Tuple */
        if (glyph.startTuple > 1) res = `(${glyph.startTuple})` + res;

        /* Add Slur / Tie */
        if (glyph.slur === "START") res = AbcStrings.Slur.START + res;
        if (glyph.slur === "END") res += AbcStrings.Slur.END;
        if (glyph.tie === "START") res += AbcStrings.TIE;

        /* Put whitespace if not connected to previous */
        if (glyph.beam == null || glyph.beam === "START") res = " " + res;
        if (glyph.beam === "END") res += " ";

        return res;
    }

    private static noteToString(note: NoteGlyph, key: KeySignature): string {
        let res = "";
        let pitch = note.midi % 12;
        let octave = (note.midi - pitch) / 12;

        /* Add fingering if present */
        if (note.fingering !== undefined) {
            res += `!${note.fingering}!`;
        }

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
        return res;
    }

    static durationToString(duration: number, punctuated: boolean): string {
        if (duration < 1) return "1/" + Math.pow(2, -duration) + (punctuated ? ">" : "");
        if (duration > 1) return Math.pow(2, duration - 1) + (punctuated ? ">" : "");
        return (punctuated ? ">" : "");
    }

    private constructor() { }
}