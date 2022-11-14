import { BarLineType } from "../Sheet/BarLine";
import { DecorationType } from "../Sheet/Decoration";

export type AbcBarLineMapping = { [key in BarLineType]: string }
export type AbcDecorationMapping = { [key in DecorationType]: string }

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
    };

    static readonly Barline: AbcBarLineMapping = {
        REPEAT_DOUBLE: '::',
        DOUBLE: "||",
        END: "|]",
        REPEAT_END: ':|',
        REPEAT_START: '|:',
        SINGLE: "|",
        START: "[|",
    }

    static readonly Pitches = [
        'C',
        'D',
        'E',
        'F',
        'G',
        'A',
        'B',
    ];
}
