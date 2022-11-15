import { Meter } from "../AbcUtils/Meter";
import { DecorationTypes } from "../Sheet/Decoration";
import { Dynamics } from "../Sheet/Dynamics";
import { BarLineGlyph, KeyGlyph, MultiMeasureRest, RestGlyph } from "../Sheet/Glyph";
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
            sys.staffs[0].addNotes(notes);
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

        const tupletSizes = [2, 3, 4, 5, 6];
        const tupletNotesNumber: number = tupletSizes.reduce((sum, a) => sum + a, 0);;

        [Dynamics, DecorationTypes, "e".repeat(tupletNotesNumber)].forEach(list => {
            const sys = sheet.addSystem();
            const startOctave = 4;
            const numberOfNotes = list.length;
            const duration = 2;
            const notes = new KeySignature('C', 'Ionian').toScale(startOctave, duration, numberOfNotes);
            sys.getStaff().addNotes(notes);
        });

        sheet.systems[0]
            .getStaff()
            .getNotes()
            .forEach((note, i) => note.dynamic = Dynamics[i]);

        sheet.systems[1]
            .getStaff()
            .getNotes()
            .forEach((note, i) => note.ornaments = [DecorationTypes[i]]);

        const tupletNotes =
            sheet.systems[2]
                .getStaff()
                .getNotes();
        let tmp = 0;
        tupletSizes.forEach((n) => {
            tupletNotes[tmp].startTuple = n;
            tmp += n;
        });

        return sheet;
    }

}