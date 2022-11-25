import { Accidental } from "../Sheet/Accidental";
import { BarLineType } from "../Sheet/BarLine";
import { DecorationType } from "../Sheet/Decoration";

export type AbcBarLineMapping = { [key in BarLineType]: string }
export type AbcDecorationMapping = { [key in DecorationType]: string }
export type AbcAccidentalMapping = { [key in Accidental]: string }

export class AbcStrings {

    static readonly Accent: AbcDecorationMapping = {
        NONE: "",
        STACCATO: ".",
        FERMATA: "H",
        FERMATA_INVERTED: "!invertedfermata!",
        CODA: "O",
        SEGNO: "S",
        TRILL: "T",
        BOW_UP: "u",
        BOW_DOWN: "v",
        ACCENT: "L",
        TENUTO: "!tenuto!",
        BREATH: "!breath!",
        ROLL: "!roll!",
        PRALLTRILLER: "!pralltriller!",
        MORDENT: "!mordent!",
        TURN: "!turn!",
        SLIDE: "!slide!",
        MARCATO: "!^!",
        STACCATISSIMO: "!wedge!",
        ARPEGGIO: "!arpeggio!",
    };

    static readonly Barline: AbcBarLineMapping = {
        REPEAT_DOUBLE: '::',
        DOUBLE: "||",
        END: "|]",
        REPEAT_END: ' :|',
        REPEAT_START: '|: ',
        SINGLE: "|",
        START: "[|",
    };

    static readonly Pitches = [
        'C',
        'D',
        'E',
        'F',
        'G',
        'A',
        'B',
    ];

    static readonly Tremolo = [
        '/',
        '//',
        '///',
        '////',
    ];

    static readonly Octave = {
        LOWER: ",",
        HIGHER: "'",
    };

    static readonly Accidental: AbcAccidentalMapping = {
        DOUBLEFLAT: "__",
        FLAT: "_",
        NATURAL: "=",
        SHARP: "^",
        DOUBLESHARP: "^^",
    };

    static readonly Creshendo = {
        START: "<(",
        END: "<)",
    };

    static readonly Diminuendo = {
        START: ">(",
        END: ">)",
    };

    static readonly TIE = "-";

    static readonly Slur = {
        START: "(",
        END: ")",
    };

}
