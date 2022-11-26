import { Meter } from "../AbcUtils/Meter";
import { RomanNumerals } from "../Chords/Chord";
import { Accidentals } from "../Sheet/Accidental";
import { DecorationTypes } from "../Sheet/Decoration";
import { Dynamics } from "../Sheet/Dynamics";
import { BarLineGlyph, KeyGlyph, MeterGlyph, MultiMeasureRest, NoteGlyph, RestGlyph } from "../Sheet/Glyph";
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
                    note.notes[0].accidental = Accidentals[i + 3];
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
        chordGlyphs.push(
            CIonian.getChord("I", "seventh", 5)
                .toGlyph(CIonian, false, 3)
        )
        const chordStaff = chordSystem.getStaff();
        chordStaff.addGlyphs(chordGlyphs);
        chordStaff.splitNote(-1);
        chordSystem.addBar("START");
        chordSystem.addBar("REPEAT_START_END");
        chordSystem.getStaff().addRests([-3, -2, -1, 1, 2, 3, 4]);
        chordSystem.addBar("REPEAT_START_END");
        chordSystem.getStaff().addGlyphs([new KeyGlyph("alto", new KeySignature("Cb"))]);
        sheet.applyBars();

        const system = sheet.addSystem();
        system.getStaff().setClef("tenor");
        system.getStaff().addGlyphs([
            new KeyGlyph("bass-8", new KeySignature("C#")),
        ]);
        system.getStaff().addNotes(NoteGlyph.fromNotes(CIonian.toScale(3, 1, 4)));
        system.getStaff().addGlyphs([
            new BarLineGlyph("DOUBLE"),
            new KeyGlyph("treble-8", new KeySignature("C")),
            new MultiMeasureRest(1),
            new BarLineGlyph("SINGLE"),
            new MultiMeasureRest(2),
            new BarLineGlyph("END"),
            new KeyGlyph("perc", new KeySignature("C")),
            new MeterGlyph(Meter.fromType("fraction", 4, 4)),
        ]);
        system.getStaff().addNotes(NoteGlyph.fromNotes(CIonian.toScale(6, 2, 3)), 4, "X");
        const percussionChord = CIonian.getChord("I", "triad", 5)
            .toGlyph(CIonian, false, 3, "X");
        system.getStaff().addChordGlyphs([percussionChord]);

        return sheet;
    }

}