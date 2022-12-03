import { Meter } from "../AbcUtils/Meter";
import { ChordTypes, RomanNumerals } from "../Chords/Chord";
import { Accidentals } from "../Sheet/Accidental";
import { BarLineType } from "../Sheet/BarLine";
import { DecorationTypes } from "../Sheet/Decoration";
import { Duration } from "../Sheet/Duration";
import { Dynamic, Dynamics } from "../Sheet/Dynamics";
import { BarLineGlyph, ChordGlyph, GlyphTypes, GlyphWithDuration, KeyGlyph, MeterGlyph, MultiMeasureRest, NoteGlyph, RestGlyph } from "../Sheet/Glyph";
import { GraceNote } from "../Sheet/GraceNote";
import { KeySignature } from "../Sheet/KeySignature";
import { Sheet } from "../Sheet/Sheet";
import { System } from "../Sheet/System";
import { RandomBag } from "./RandomBag";
import { RandomUtils } from "./RandomUtils";

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
        const CIonian = new KeySignature('C', 'Ionian');

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
            if (i === 0) {
                tupletStaff.getNotes()
                    .forEach(note => {
                        note.notes[0].accidental = Accidentals[i + 2];
                    });
            } else {
                tupletStaff.getNotes()
                    .forEach(note => {
                        const copyNote = { ...note.notes[0] };
                        const shift = Math.ceil(Math.random() * 6 + 2);
                        const sign = Math.round(Math.random()) * 2 - 1;
                        const type = Math.round(Math.random());
                        copyNote.midi += shift * sign;
                        if (shift === 0) copyNote.midi += 2 * sign;
                        console.log(type, type ? "ACCIACCATURA" : "APPOGGIATURA");
                        note.graceNote = new GraceNote(type ? "ACCIACCATURA" : "APPOGGIATURA", NoteGlyph.fromNote(copyNote));
                    });
            }
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
        chordStaff.splitEven(chordGlyphs[chordGlyphs.length - 1]);
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
            new MultiMeasureRest(20),
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

    static generatePianoSheet(pageNr = 1): Sheet {
        const sheet = new Sheet();
        sheet.options.systemType = "grand-staff";
        sheet.options.meter = Meter.fromType("C");
        const systems: System[] = [];

        /* useful constants */
        const CIonian = new KeySignature('C', 'Ionian');
        const BASE_DURATIONS = [5, 4, 3, 2, 1, -1, -2, -3];

        for (let systemIndex = 0; systemIndex < 4; systemIndex++) {
            /* Add grand staff */
            const system = sheet.addSystem();
            systems.push(system)
            let isSpaceLeft = true;
            let repeatSignCounter = 0;

            while (isSpaceLeft) {

                /* Generate random durations */
                const duration = new Duration(Meter.fromType("C"));
                const rndDurations = duration.getRandomDurations(9);
                const n = rndDurations.length;

                for (let staffNr = 0; staffNr < 2; staffNr++) {

                    /* Prepare Glyphs */
                    let chordGlyphs: ChordGlyph[] = [];
                    for (const numeral of RomanNumerals) {
                        for (const chordType of ChordTypes) {
                            const nInversions = chordType === "triad" ? 2 : 3;
                            for (let inversion = 0; inversion < nInversions; inversion++) {
                                const chord = CIonian.getChord(numeral, chordType, 5 - (staffNr % 2) * 2, inversion);
                                chordGlyphs.push(chord.toGlyph(CIonian));
                            }
                        }
                    }

                    /* Add Single Notes */
                    let noteGlyphs: ChordGlyph[] = NoteGlyph
                        .fromNotes(CIonian.toScale(4 - (staffNr % 2) * 2, 1, 27))
                        .map(noteGlyph => new ChordGlyph([noteGlyph]));

                    /* Add Rests */
                    let restGlyphs = [new RestGlyph(BASE_DURATIONS[0])];

                    /* Generate random glyphs */
                    const rb = new RandomBag<GlyphWithDuration>();
                    rb.addItems('n-of', chordGlyphs, Math.floor(n / 2));
                    rb.addItems('each-once', restGlyphs);
                    rb.addItems('n-of', noteGlyphs, Math.floor(n / 2));
                    rb.generate(n);
                    const rndGlyphs = rb.take(n);

                    /* Fuse durations with glyphs */
                    rndGlyphs.forEach((glyph, idx) => glyph.duration = rndDurations[idx]);

                    system.getStaff(staffNr).addGlyphs(rndGlyphs);
                }
                isSpaceLeft = system.getStaff().glyphs.length <= 20;
                let type: BarLineType = "SINGLE";
                if (systemIndex === 3 && !isSpaceLeft) type = "END";
                if (systemIndex === 2 && isSpaceLeft) {
                    type = repeatSignCounter === 0 ? "REPEAT_START" : "REPEAT_DOUBLE";
                    repeatSignCounter++;
                };
                if (systemIndex === 2 && !isSpaceLeft) type = "REPEAT_END";
                system.getStaff(0).addGlyphs([new BarLineGlyph(type)]);
                system.getStaff(1).addGlyphs([new BarLineGlyph(type)]);
            }
            /* Add beams */
            RandomUtils.take(system.getStaff(0).getNotes(), 4).forEach(note => note.beam = "MIDDLE");

            /* Add accidentals */
            RandomUtils.take(system.getStaff(0).getNotes(), 4).forEach(note => {
                RandomUtils.takeSingle(note.notes).accidental = RandomUtils.takeSingle([...Accidentals]);
            });

            /* Add slurs */
            let rndGroup = RandomUtils.takeSingle(system.getStaff(0).getSuccessiveChords(3));
            let rndPair = RandomUtils.takeIntervalRange(rndGroup, 1, 2);
            rndPair[0].slur = "START";
            rndPair[1].slur = "END";
            console.log("SLUR", rndPair);

            rndGroup = RandomUtils.takeSingle(system.getStaff(1).getSuccessiveChords(3));
            rndPair = RandomUtils.takeIntervalRange(rndGroup, 1, 2);
            rndPair[0].slur = "START";
            rndPair[1].slur = "END";
            console.log("TIE", rndPair);
        }

        /* Add key signatures */
        systems[0].getStaff(0).setKey(new KeySignature("Cb"));
        systems[1].getStaff(0).setKey(new KeySignature("C#"));
        systems[2].getStaff(1).setKey(new KeySignature("C"));
        systems[2].getStaff(1).setMeter(Meter.fromType("fraction", 4, 4));

        /* Add dynamics */
        let rndPair = RandomUtils.takeIntervalRange(systems[0].getStaff(0).getNotes(), 2, 5);
        rndPair[0].creshendo = "START";
        rndPair[1].creshendo = "END";
        console.log("CRESHENDO", rndPair);

        rndPair = RandomUtils.take(systems[1].getStaff(0).getNotes(), 2, true, 2);
        rndPair[0].diminuendo = "START";
        rndPair[1].diminuendo = "END";

        /* Add tie */
        let longNotes = sheet.getNotes().filter(note => BASE_DURATIONS.indexOf(note.duration) < 4);
        const tieNote = RandomUtils.takeSingle(longNotes);
        const tieStaff = sheet.getStaffOf(tieNote);
        tieStaff.splitEven(tieNote, true);

        /* Add triplet */
        longNotes = sheet.getNotes().filter(note => BASE_DURATIONS.indexOf(note.duration) < 4);
        const tupletNote = RandomUtils.takeSingle(longNotes);
        sheet.getStaffOf(tupletNote).splitToTriplet(tupletNote);

        // /* Add punctuation */
        longNotes = sheet.getNotes().filter(note => BASE_DURATIONS.indexOf(note.duration) < 4);
        const punctuationNote = RandomUtils.takeSingle(longNotes);
        const punctuationStaff = sheet.getStaffOf(punctuationNote);
        punctuationStaff.splitToPunctuation(punctuationNote);

        /* Add whole note and whole rest */
        const barline = RandomUtils.takeSingle(sheet.systems[0].staffs[0].glyphs.filter(glyph => glyph.type === "barline"));
        const barlineIdx = sheet.systems[0].staffs[0].glyphs.indexOf(barline);
        sheet.systems[0].staffs[0].modifyAtIdx("replace", barlineIdx, [
            new BarLineGlyph(),
            new RestGlyph(4),
            new BarLineGlyph(),
        ]);
        sheet.systems[0].staffs[1].modifyAtIdx("replace", barlineIdx, [
            new BarLineGlyph(),
            CIonian.getChord(RandomUtils.takeSingle([...RomanNumerals]), "seventh", 4, RandomUtils.randInt(0, 2)).toGlyph(CIonian, false, 4),
            new BarLineGlyph(),
        ]);

        rndPair = RandomUtils.take(systems[3].getStaff(0).getNotes(), 2);
        const dynamicsRB = new RandomBag<Dynamic>()
        dynamicsRB.addItems("one-of", ["mf", "mp"])
        dynamicsRB.addItems("one-of", ["f", "ff", "fff", "ffff", "p", "pp", "ppp", "pppp"]);
        dynamicsRB.generate(2);
        const dynamics = dynamicsRB.take(2);
        console.log(dynamics, dynamics.every(d => d.indexOf("f") !== -1), dynamics.every(d => d.indexOf("p") !== -1));

        if (dynamics.every(d => d.indexOf("f") !== -1)) {
            dynamics[0] = dynamics[0].replace("f", "p") as Dynamic;
        }
        if (dynamics.every(d => d.indexOf("p") !== -1)) {
            dynamics[0] = dynamics[0].replace("p", "f") as Dynamic;
        }
        dynamics.forEach((dynamic, idx) => rndPair[idx].dynamic = dynamic);

        return sheet
    }

}