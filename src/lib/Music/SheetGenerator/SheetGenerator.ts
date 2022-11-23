import { Meter } from "../AbcUtils/Meter";
import { RomanNumerals } from "../Chords/Chord";
import { Accidentals } from "../Sheet/Accidental";
import { DecorationTypes } from "../Sheet/Decoration";
import { Dynamics } from "../Sheet/Dynamics";
import { BarLineGlyph, KeyGlyph, MultiMeasureRest, NoteGlyph, RestGlyph } from "../Sheet/Glyph";
import { KeySignature } from "../Sheet/KeySignature";
import { Sheet } from "../Sheet/Sheet";

export class SheetGenerator {

    static generateScaleSheet(): Sheet {
        const sheet = new Sheet();

        const durations = [-3, -2, -1, 1, 2, 3, 4, 5];
        durations.forEach(duration => {
            const sys = sheet.addSystem();
            const startOctave = 4;
            const numberOfNotes = 27;
            const notes = new KeySignature('C', 'Ionian').toScale(startOctave, duration, numberOfNotes);
            sys.staffs[0].addNotes(NoteGlyph.fromNotes(notes));
        });

        const sys = sheet.addSystem();
        const rests = [-3, -2, -1, 1, 2, 3, 4].map(duration => ({ duration: duration, type: 'rest' } as RestGlyph));
        sys.staffs[0].setClef("bass");
        sys.staffs[0].setKey(new KeySignature("Cb"));
        sys.staffs[0].setMeter(Meter.fromType("fraction", "0123456789", "0987654321"))
        const glyphs = [
            new BarLineGlyph('START'),
            new BarLineGlyph('REPEAT_START'),
            ...rests,
            new BarLineGlyph('REPEAT_DOUBLE'),
            new MultiMeasureRest('1'),
            new KeyGlyph("alto", new KeySignature("C#")),
            new KeyGlyph("treble-8", new KeySignature("C")),
        ];
        sys.staffs[0].addGlyphs(glyphs);

        return sheet;
    }

    static generateOrnamentsSheet(): Sheet {
        const sheet = new Sheet();

        const tupletSizesA = [2, 3, 4, 5, 6];
        const tupletSizesB = [7, 8, 9];
        const tupletNotesNumberA: number = tupletSizesA.reduce((sum, a) => sum + a, 0);;
        const tupletNotesNumberB: number = tupletSizesB.reduce((sum, a) => sum + a, 0);;
        const placeholdersA = "e".repeat(tupletNotesNumberA);
        const placeholdersB = "e".repeat(tupletNotesNumberB);
        const placeholders = [
            placeholdersA, placeholdersB,
            placeholdersA, placeholdersB,
        ];

        const filteredDecorationTypes = DecorationTypes.filter(type => type !== "ARPEGGIO");

        [Dynamics, filteredDecorationTypes, ...placeholders].forEach(list => {
            const sys = sheet.addSystem();
            const startOctave = 4;
            const numberOfNotes = list.length;
            const duration = 2;
            const notes = new KeySignature('C', 'Ionian').toScale(startOctave, duration, numberOfNotes);
            sys.getStaff().addNotes(NoteGlyph.fromNotes(notes));
        });

        sheet.systems[0]
            .getStaff()
            .getNotes()
            .forEach((note, i) => {
                note.dynamic = Dynamics[i];
                note.notes[0].accidental = "DOUBLEFLAT";
                if (i < 4) note.tremolo = i + 1;
            });
        sheet.systems[0].getStaff().setMeter(Meter.fromType("C"));

        sheet.systems[1]
            .getStaff()
            .getNotes()
            .forEach((note, i) => {
                note.ornaments = [filteredDecorationTypes[i]];
                note.notes[0].accidental = "FLAT";
                if (i === 0) note.punctuated = true;
            });
        sheet.systems[1].getStaff().setMeter(Meter.fromType("C|"));

        [tupletSizesA, tupletSizesB].forEach((tupletSizes, i) => {
            const tupletStaff = sheet.systems[2 + i].getStaff();
            tupletStaff.getNotes()
                .forEach(note => {
                    note.notes[0].accidental = Accidentals[i + 2];
                });
            let tmp = 0;
            tupletSizes.forEach((n, idx) => {
                const noteGroup = tupletStaff.getNoteGroup(tmp, tmp + n);
                noteGroup.nTuplet();
                noteGroup.slur();
                if (idx % 2) noteGroup.diminuendo();
                else noteGroup.creshendo();
                tmp += n;
            });
        });

        [tupletSizesA, tupletSizesB].forEach((tupletSizes, i) => {
            const tupletStaff = sheet.systems[4 + i].getStaff();
            tupletStaff.getNotes()
                .forEach((note, idx) => {
                    note.notes[0].accidental = Accidentals[i + 2];
                    note.duration = 1;
                    if (idx < 6) note.notes[0].fingering = idx;
                });
            let tmp = 0;
            tupletSizes.forEach((n, idx) => {
                const noteGroup = tupletStaff.getNoteGroup(tmp, tmp + n);
                noteGroup.nTuplet();
                noteGroup.beam();
                noteGroup.slur();
                if (idx % 2) noteGroup.creshendo();
                else noteGroup.diminuendo();
                tmp += n;
            });
        });

        const CIonian = new KeySignature('C', 'Ionian');
        const chordSystem = sheet.addSystem();
        const chordGlyphs = RomanNumerals
            .map((romanNumeral, idx) =>
                CIonian.getChord(romanNumeral, "seventh", 5, idx % 4)
                    .toGlyph(CIonian, true, idx % 5 + 1)
            );
        chordSystem.getStaff().addGlyphs(chordGlyphs);
        console.log(chordGlyphs);


        return sheet;
    }

}