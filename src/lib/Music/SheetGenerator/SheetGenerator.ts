import { Meter } from "../AbcUtils/Meter";
import { BarLineGlyph, KeyGlyph, MultiMeasureRest, RestGlyph } from "../Sheet/Glyph";
import { KeySignature } from "../Sheet/KeySignature";
import { Sheet } from "../Sheet/Sheet";

export class SheetGenerator {

    static generateScaleSheet(): Sheet {
        const sheet = new Sheet();

        [-3, -2, -1, 1, 2, 3, 4, 5].forEach(duration => {
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
            new BarLineGlyph('start'),
            new BarLineGlyph('repeat-start'),
            ...rests,
            new BarLineGlyph('repeat-double'),
            new MultiMeasureRest('1'),
            new KeyGlyph("alto", new KeySignature("C#")),
            new KeyGlyph("treble-8", new KeySignature("C")),
        ];
        sys.staffs[0].addGlyphs(glyphs);

        return sheet;
    }

    static generateOrnamentsSheet(): Sheet {
        const sheet = new Sheet();

        const sys = sheet.addSystem();
        const startOctave = 4;
        const numberOfNotes = 27;
        const duration = 2;
        const notes = new KeySignature('C', 'Ionian').toScale(startOctave, duration, numberOfNotes);
        sys.staffs[0].addNotes(notes);

        return sheet;
    }

}