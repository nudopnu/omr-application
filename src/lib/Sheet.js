export function generateRandomSheet() {
    return {
        grandStaffs: [
            {
                treble: [],
                bass: [],
            }
        ]
    };
}

export function chordToAbc(note) {
    const { values, duration } = note;
    let res = [values.map(v => {
        let octave = Math.round(v / 12);
        let pitch = v % 12;
    })].join('');

}

const pitches = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
];

const accidentals = [
    '__',
    '_',
    '=',
    '^',
    '^^',
];

const accents = [
    '.',
    '~',
    'H',
    'L',
    'M',
    'O',
    'P',
    'S',
    'T',
];

const classes = {
    'abcjs-annotation': [],
    'abcjs-author': [],
    'abcjs-bar': [],
    'abcjs-bar-number': [],
    'abcjs-beam-elem': [],
    'abcjs-brace': ['#010101', '#8C3BFF'],
    'abcjs-bracket': [],
    'abcjs-chord': [],
    'abcjs-clef': [],
    'abcjs-composer': [],
    'abcjs-d0-25': [],
    'abcjs-decoration': [],
    'abcjs-defined-text': [],
    'abcjs-dynamics': [],
    'abcjs-end-m0-n0': [],
    'abcjs-ending': [],
    'abcjs-key-signature': [],
    'abcjs-l0': [],
    'abcjs-ledger': [],
    'abcjs-lyric': [],
    'abcjs-m0': [],
    'abcjs-mm0': [],
    'abcjs-meta-bottom': [],
    'abcjs-meta-top': [],
    'abcjs-n0': [],
    'abcjs-note_selected': [],
    'abcjs-p-1': [],
    'abcjs-part': [],
    'abcjs-part-order': [],
    'abcjs-rest': [],
    'abcjs-rhythm': [],
    'abcjs-slur': [],
    'abcjs-start-m0-n0': [],
    'abcjs-tie': [],
    'abcjs-legato': [],
    'abcjs-staff': [],
    'abcjs-staff-extra': [],
    'abcjs-stem': [],
    'abcjs-subtitle': [],
    'abcjs-symbol': [],
    'abcjs-tempo': [],
    'abcjs-text': [],
    'abcjs-time-signature': [],
    'abcjs-title': [],
    'abcjs-top-line': [],
    'abcjs-top-of-system': [],
    'abcjs-triplet': [],
    'abcjs-unaligned-words': [],
    'abcjs-v0': [],
}

export const ABC_CLASSES = {
    'background': ['#abc-render', "#000000", "#FFFFFF"],
    'NoteheadBlack': ['.abcjs-note[class*="abcjs-d"]:not(.abcjs-d0-5, .abcjs-d1, .abcjs-d2) > path:not([data-name*="accidental"], [data-name*="dot"], [data-name*=flag], [data-name*="scripts"], [class])', '#010101', '#8287FF'],
    'NoteheadHalf': ['.abcjs-note.abcjs-d0-5 > path:not([data-name*="accidental"], [data-name*="dot"], [data-name*="scripts"], [class])', '#020202', '#BDE6BF'],
    'NoteheadWhole': ['.abcjs-note.abcjs-d1 > path:not([data-name*="accidental"], [data-name*="dot"], [data-name*="scripts"], [class])', '#030303', '#2F5282'],
    // doublewhole: .abcjs-note.abcjs-d2 > path:not([data-name*="accidental"], [data-name*="dot"], [data-name*=flag], [data-name*="scripts"], [class])
    'Stem': ['.abcjs-stem', '#040404', '#85A301'],
    'Beam': ['.abcjs-beam-elem', '#050505', '#6B05E8'],
    'Arc': ['.abcjs-slur,.abcjs-tie', '#060606', '#75BC4F'],
    'Brace': ['.abcjs-brace', '#070707', '#8C3BFF'],
    'Staff': ['.abcjs-staff', '#080808', '#9E90AF'],
    'LedgerLine': [".abcjs-ledger", "090909", "#018700"],
    'BarLine': [".abcjs-bar", "0A0A0A", "#00ACC6"],
    'BarLineThick': [".abcjs-bar", "0B0B0B", "#97FF00"],
    'ClefF': ['.abcjs-staff-extra > [data-name*="clefs.F"]', "0C0C0C", "#BCB6FF"],
    'ClefG': ['.abcjs-staff-extra > [data-name*="clefs.G"]', "0D0D0D", "#0000DD"],
    'Sharp': ['[data-name*="accidentals.sharp"]', "0E0E0E", "#C8FFF9"],
    'Flat': ['[data-name*="accidentals.flat"]', "0F0F0F", "#364426"],
    'Natural': ['[data-name*="accidentals.nat"]', "101010", "#8E8C5E"],
    'AccidentalDoubleFlat': ['[data-name*="accidentals.dblflat"]', "111111", "#BFFF8C"],
    'AccidentalDoubleSharp': ['[data-name*="accidentals.dblsharp"]', "121212", "#6ECFA7"],
    'Flag8thUp': ['[data-name*="flags.u8th"]', "131313", "#00D6D4"],
    'Flag16thUp': ['[data-name*="flags.u16th"]', "141414", "#F9FF00"],
    'Flag32ndUp': ['[data-name*="flags.u32nd"]', "151515", "#6967AF"],
    'Flag64thUp': ['[data-name*="flags.u64th"]', "161616", "#C39700"],
    // 'Flag128thUp': ['[data-name*="flags.u128th"]', "171717", "#E1CD9C"], // Not available
    'Flag8thDown': ['[data-name*="flags.d8th"]', "181818", "#DA95FF"],
    'Flag16thDown': ['[data-name*="flags.d16th"]', "191919", "#915282"],
    'Flag32ndDown': ['[data-name*="flags.d32nd"]', "1A1A1A", "#A00072"],
    'Flag64thDown': ['[data-name*="flags.d64th"]', "1B1B1B", "#569A54"],
    // 'Flag128thDown': ['', "1C1C1C", "#D38C8E"],
    'AugmentationDot': ['.abcjs-note > [data-name*="dots.dot"]', "1D1D1D", "#4D33FF"],
    // 'RestDoubleWhole': ['', "1E1E1E", "#7C5900"], // Not available
    'RestWhole': ['[data-name="rests.whole"]', "1F1F1F", "#FFCD44"],
    'RestHalf': ['[data-name="rests.half"]', "202020", "#8201CF"],
    'RestQuarter': ['[data-name="rests.quarter"]', "212121", "#4DFDFF"],
    'Rest8th': ['[data-name*="rests.8th"]', "222222", "#89003D"],
    'Rest16th': ['[data-name*="rests.16th"]', "232323", "#7B525B"],
    'Rest32nd': ['[data-name*="rests.32nd"]', "242424", "#00749C"],
    'Rest64th': ['[data-name*="rests.64th"]', "252525", "#AA8297"],
    // 'Rest128th': ['', "262626", "#80708E"], // Not available
}
