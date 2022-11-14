import { BarLineType, BarLineTypes } from "../Sheet/BarLine";

export const AbcAccents = [
    '.',
    '~',
    'H',
    'O',
    'P',
    'S',
    'T',
    ''
] as const;

export type AbcBarLineMapping = { [key in BarLineType]: string }

export class AbcStrings {
    static readonly Accent = {
        TENUTO: '',
    };

    static readonly Barline: AbcBarLineMapping = {
        "repeat-double": '::',
        "double": "||",
        "end": "|]",
        "repeat-end": ':|',
        "repeat-start": '|:',
        "single": "|",
        "start": "[|",
    }
}

const x = {
    SINGLE: '|',
    DOUBLE: '||',
    END: '|]',
    START: '[|',
    REPEAT_START: '|:',
    REPEAT_END: ':|',
    REPEAT_START_END: '::',
}