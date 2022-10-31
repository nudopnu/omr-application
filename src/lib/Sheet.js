const durationFromName = {
    'Double-whole': 128,
    'Whole': 64,
    'Half': 32,
    'Quarter': 16,
    '8th': 8,
    '16th': 4,
    '32nd': 2,
    '64th': 1,
};

function randIntInRange(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

const randRangeProto = {
    take: function () {
        if (this.idcs.length === 0) {
            this.idcs = [...Array(this.list.length).keys()];
            shuffleArray(this.idcs);
            this.idcs = this.idcs.concat(this.idcs.slice(0, this.chunksize - (this.list.length % this.chunksize)));
        }
        let result = this.idcs.slice(0, this.chunksize);
        this.idcs = this.idcs.slice(this.chunksize);
        return result.map(i => this.list[i]);
    }
}

function RandChunks(list, chunksize) {
    this.list = [...list];
    this.chunksize = chunksize;
    this.idcs = [...Array(this.list.length).keys()];
    shuffleArray(this.idcs);
    this.idcs = this.idcs.concat(this.idcs.slice(0, this.chunksize - (this.list.length % this.chunksize)));
}

Object.assign(RandChunks.prototype, randRangeProto);

export function generateRandomSheet(settings) {
    let res = "X:1\n";

    res += "T: Random Piano Sheet\n";

    /* Set minimal duration */
    res += "L:1/64\n";

    /* Make Grand Staff */
    res += "%%score {V1 V2\n";
    res += "V: V1 clef=treble\n";
    res += "V: V2 clef=bass\n";

    let bassNotesRange = [];
    let accidentalsRange = [];

    /* Generate note durations-range */
    let noteDurationsRange = [];
    settings.notes.subsettings.durations.subsettings.forEach(setting => {
        if (setting.value) {
            let duration = durationFromName[setting.name];
            noteDurationsRange.push(duration);
        }
    });

    /* Generate rest durations-range */
    let restDurationsRange = [];
    settings.rests.subsettings.durations.subsettings.forEach(setting => {
        if (setting.value) {
            let duration = durationFromName[setting.name];
            restDurationsRange.push(duration);
        }
    });

    /* Generate treble note-range */
    const lowTreble = settings.notes.subsettings.rangeTreble.subsettings[0].value;
    const highTreble = settings.notes.subsettings.rangeTreble.subsettings[1].value;
    let trebleNotesRange = [];
    for (let pitch = lowTreble; pitch <= highTreble; pitch++) {
        let relPitch = pitch + 1;
        if (relPitch < 0)
            relPitch += Math.ceil(relPitch / -7) * 7;
        let note = pitches[relPitch % 7];
        if (pitch < 6) {
            note += ",".repeat(Math.floor(Math.abs(6 - pitch) / 7));
        } else {
            note += "'".repeat(Math.floor((pitch - 6) / 7));
        }
        trebleNotesRange.push(note);
    }

    /* Generate bass note-range */
    const lowBass = settings.notes.subsettings.rangeBass.subsettings[0].value;
    const highBass = settings.notes.subsettings.rangeBass.subsettings[1].value;
    for (let pitch = lowBass; pitch <= highBass; pitch++) {
        let relPitch = pitch + 3;
        if (relPitch < 0)
            relPitch += Math.ceil(relPitch / -7) * 7;
        let note = pitches[relPitch % 7];
        if (pitch < 18) {
            note += ",".repeat(Math.floor(Math.abs(18 - pitch) / 7));
        } else {
            note += "'".repeat(Math.floor((pitch - 18) / 7));
        }
        bassNotesRange.push(note);
    }

    /* Generate number-of-simultaneos-notes-range */
    const minSimultaneosNotes = settings.notes.subsettings.rangeNumOfSimNotes.subsettings[0].value;
    const maxSimultaneosNotes = settings.notes.subsettings.rangeNumOfSimNotes.subsettings[1].value;
    const numSimNotes = [];
    let sumNumSimNotes = 0;
    for (let num = minSimultaneosNotes; num <= maxSimultaneosNotes; num++) {
        numSimNotes.push(num);
        sumNumSimNotes += num;
    }

    /* Generate accidentals-range */
    settings.notes.subsettings.accidentals.subsettings.forEach((setting, idx) => {
        if (setting.value)
            accidentalsRange.push(accidentals[idx]);
    })
    accidentalsRange.push("");

    const minNotesPerStaff = settings.notes.subsettings.rangeNotesPerStaff.subsettings[0].value;
    const maxNotesPerStaff = settings.notes.subsettings.rangeNotesPerStaff.subsettings[1].value;
    const minRestsPerStaff = settings.rests.subsettings.rangeRestsPerStaff.subsettings[0].value;
    const maxRestsPerStaff = settings.rests.subsettings.rangeRestsPerStaff.subsettings[1].value;

    /* Generate lines */
    const numOfLines = 4;
    for (let i = 0; i < numOfLines; i++) {
        let trebleGlyphs = [];
        let bassGlyphs = [];

        const numNotes = randIntInRange(minNotesPerStaff, maxNotesPerStaff);
        const numRests = randIntInRange(minRestsPerStaff, maxRestsPerStaff);

        /* Generate Notes */
        let trebleChunks = new RandChunks(trebleNotesRange, sumNumSimNotes);
        let bassChunks = new RandChunks(bassNotesRange, sumNumSimNotes);
        let trebleNoteDurationChunks = new RandChunks(noteDurationsRange, numSimNotes.length);
        let bassNoteDurationChunks = new RandChunks(noteDurationsRange, numSimNotes.length);
        for (let i = 0; i < Math.floor(numNotes / sumNumSimNotes); i++) {
            let nextTrebleNotes = trebleChunks.take();
            let nextTrebleDurations = trebleNoteDurationChunks.take();
            let nextBassNotes = bassChunks.take();
            let nextBassDurations = bassNoteDurationChunks.take();
            let offset = 0;
            for (let j = 0; j < numSimNotes.length; j++) {
                const chordSize = numSimNotes[j];
                trebleGlyphs.push({
                    type: 'chord',
                    notes: nextTrebleNotes.slice(offset, offset + chordSize),
                    duration: nextTrebleDurations[j],
                });
                bassGlyphs.push({
                    type: 'chord',
                    notes: nextBassNotes.slice(offset, offset + chordSize),
                    duration: nextBassDurations[j],
                });
            }
        }

        /* Add accidentals to some notes */
        let startIdx = randIntInRange(0, trebleGlyphs.length)
        for (let i = 0; i < accidentalsRange.length; i++) {
            const accidental = accidentalsRange[i];
            const glyph = trebleGlyphs[(startIdx + 7 * i) % trebleGlyphs.length];
            const notesIdx = randIntInRange(0, glyph.notes.length);
            glyph.notes[notesIdx] = accidental + glyph.notes[notesIdx];
            console.log(accidentalsRange, glyph.notes[notesIdx]);
        }


        /* Generate Rests */
        for (let i = 0; i < restDurationsRange.length; i++) {
            const duration = restDurationsRange[i];
            trebleGlyphs.push({
                type: 'rest',
                duration: duration,
            });
            bassGlyphs.push({
                type: 'rest',
                duration: duration,
            });
        }

        /* Additional rests to make lines same duration */
        let totalTrebleDuration = 0;
        let totalBassDuration = 0;
        let deltaDuration = 0;
        let deficiteGlyphs;
        for (let i = 0; i < trebleGlyphs.length; i++) {
            const { duration } = trebleGlyphs[i];
            totalTrebleDuration += duration;
        }
        for (let i = 0; i < bassGlyphs.length; i++) {
            const { duration } = bassGlyphs[i];
            totalBassDuration += duration;
        }
        if (totalTrebleDuration > totalBassDuration) {
            deltaDuration = totalTrebleDuration - totalBassDuration;
            deficiteGlyphs = bassGlyphs;
        }
        else if (totalTrebleDuration < totalBassDuration) {
            deltaDuration = totalBassDuration - totalTrebleDuration;
            deficiteGlyphs = trebleGlyphs;
        }
        const tmpDurations = [64, 32, 16, 8, 4, 2, 1];
        while (deltaDuration > 0) {
            for (let i = 0; i < tmpDurations.length; i++) {
                const duration = tmpDurations[i];
                if (deltaDuration >= duration) {
                    deficiteGlyphs.push({
                        type: 'rest',
                        duration: duration,
                    });
                    deltaDuration -= duration;
                }
            }
        }

        /* Shuffle glyphs */
        shuffleArray(bassGlyphs);
        shuffleArray(trebleGlyphs);

        /* Convert treble notes to abc */
        res += "[V:V1]\n";
        for (let i = 0; i < trebleGlyphs.length; i++) {
            const glyph = trebleGlyphs[i];
            if ((i + 1) % 4 === 0) {
                res += "|";
            }
            if (glyph.type === 'chord') {
                const { notes, duration } = glyph;
                res += `[${notes.join("")}]${duration}`;
            }
            else if (glyph.type === 'rest') {
                const { duration } = glyph;
                res += ` z${duration}`;
            }
        };
        res += "|\n";

        /* Convert bass notes to abc */
        res += "[V:V2]\n";
        for (let i = 0; i < bassGlyphs.length; i++) {
            const glyph = bassGlyphs[i];
            if ((i + 1) % 4 === 0) {
                res += "|";
            }
            if (glyph.type === 'chord') {
                const { notes, duration } = glyph;
                res += `[${notes.join("")}]${duration}`;
            }
            else if (glyph.type === 'rest') {
                const { duration } = glyph;
                res += ` z${duration}`;
            }
        };
        res += "|\n";
    }

    return res;
}

const pitches = [
    'c',
    'd',
    'e',
    'f',
    'g',
    'a',
    'b',
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

export const ABC_CLASSES = {
    // 'background': ['#abc-render', "#000000", "#FFFFFF"],
    'NoteheadBlack': [{ selector: '.abcjs-note[class*="abcjs-d"]:not(.abcjs-d0-5, .abcjs-d1, .abcjs-d2) > path:not([data-name*="accidental"], [data-name*="dot"], [data-name*=flag], [data-name*="scripts"], [class]), [data-name="noteheads.quarter"]' }, '#010101', '#8287FF'],
    'NoteheadHalf': [{ selector: '.abcjs-note.abcjs-d0-5 > path:not([data-name*="accidental"], [data-name*="dot"], [data-name*="scripts"], [class])' }, '#020202', '#BDE6BF'],
    'NoteheadWhole': [{ selector: '.abcjs-note.abcjs-d1 > path:not([data-name*="accidental"], [data-name*="dot"], [data-name*="scripts"], [class])' }, '#030303', '#2F5282'],
    // doublewhole: .abcjs-note.abcjs-d2 > path:not([data-name*="accidental"], [data-name*="dot"], [data-name*=flag], [data-name*="scripts"], [class])
    'Stem': [{ selector: '.abcjs-stem' }, '#040404', '#85A301'],
    'Beam': [{ selector: '.abcjs-beam-elem' }, '#050505', '#6B05E8'],
    'Arc': [{ selector: '.abcjs-slur,.abcjs-tie' }, '#060606', '#75BC4F'],
    'Brace': [{ selector: '.abcjs-brace' }, '#070707', '#8C3BFF'],
    'Staff': [{ selector: '.abcjs-staff' }, '#080808', '#9E90AF'],
    'LedgerLine': [{ selector: ".abcjs-ledger" }, "090909", "#018700"],
    'BarLine': [{ selector: ".abcjs-bar > :not([data-name*='dot'])", aspectRatio: 0.019 }, "0A0A0A", "#00ACC6"],
    'BarLineLong': [{ selector: "g:not([class]) > path:not([class])" }, "0A0A0A", "#00ACC6"],
    'BarLineLong2': [{ selector: "path[data-name*=bar]", aspectRatio: 0.003, condition: (a, b) => a < b }, "0A0A0A", "#00ACC6"],
    'BarLineThick': [{ selector: ".abcjs-bar > :not([data-name*='dot'])", aspectRatio: 0.129 }, "0B0B0B", "#97FF00"],
    'ClefF': [{ selector: '.abcjs-staff-extra > [data-name*="clefs.F"]' }, "0C0C0C", "#BCB6FF"],
    'ClefG': [{ selector: '.abcjs-staff-extra > [data-name*="clefs.G"]' }, "0D0D0D", "#0000DD"],
    'Sharp': [{ selector: '[data-name*="accidentals.sharp"]' }, "0E0E0E", "#C8FFF9"],
    'Flat': [{ selector: '[data-name*="accidentals.flat"]' }, "0F0F0F", "#364426"],
    'Natural': [{ selector: '[data-name*="accidentals.nat"]' }, "101010", "#8E8C5E"],
    'AccidentalDoubleFlat': [{ selector: '[data-name*="accidentals.dblflat"]' }, "111111", "#BFFF8C"],
    'AccidentalDoubleSharp': [{ selector: '[data-name*="accidentals.dblsharp"]' }, "121212", "#6ECFA7"],
    'Flag8thUp': [{ selector: '[data-name*="flags.u8th"]' }, "131313", "#00D6D4"],
    'Flag16thUp': [{ selector: '[data-name*="flags.u16th"]' }, "141414", "#F9FF00"],
    'Flag32ndUp': [{ selector: '[data-name*="flags.u32nd"]' }, "151515", "#6967AF"],
    'Flag64thUp': [{ selector: '[data-name*="flags.u64th"]' }, "161616", "#C39700"],
    // 'Flag128thUp': ['[data-name*="flags.u128th"]', "171717", "#E1CD9C"], // Not available
    'Flag8thDown': [{ selector: '[data-name*="flags.d8th"]' }, "181818", "#DA95FF"],
    'Flag16thDown': [{ selector: '[data-name*="flags.d16th"]' }, "191919", "#915282"],
    'Flag32ndDown': [{ selector: '[data-name*="flags.d32nd"]' }, "1A1A1A", "#A00072"],
    'Flag64thDown': [{ selector: '[data-name*="flags.d64th"]' }, "1B1B1B", "#569A54"],
    // 'Flag128thDown': ['', "1C1C1C", "#D38C8E"],
    'AugmentationDot': [{ selector: '.abcjs-note > [data-name*="dots.dot"]' }, "1D1D1D", "#4D33FF"],
    // 'RestDoubleWhole': ['', "1E1E1E", "#7C5900"], // Not available
    'RestWhole': [{ selector: '[data-name="rests.whole"]' }, "1F1F1F", "#FFCD44"],
    'RestHalf': [{ selector: '[data-name="rests.half"]' }, "202020", "#8201CF"],
    'RestQuarter': [{ selector: '[data-name="rests.quarter"]' }, "212121", "#4DFDFF"],
    'Rest8th': [{ selector: '[data-name*="rests.8th"]' }, "222222", "#89003D"],
    'Rest16th': [{ selector: '[data-name*="rests.16th"]' }, "232323", "#7B525B"],
    'Rest32nd': [{ selector: '[data-name*="rests.32nd"]' }, "242424", "#00749C"],
    'Rest64th': [{ selector: '[data-name*="rests.64th"]' }, "252525", "#AA8297"],
    // 'Rest128th': ['', "262626", "#80708E"], // Not available
}

export const DEFAULF_GENERATOR_SETTINGS = {
    type: 'SETTINGS',
    name: 'Generator',
    settings: {
        notes: {
            subsettings: {
                durations: {
                    name: 'Durations', type: 'FLAGS', subsettings: [
                        { name: 'Double-whole', type: 'BOOL', value: false },
                        { name: 'Whole', type: 'BOOL', value: true },
                        { name: 'Half', type: 'BOOL', value: true },
                        { name: 'Quarter', type: 'BOOL', value: true },
                        { name: '8th', type: 'BOOL', value: true },
                        { name: '16th', type: 'BOOL', value: true },
                        { name: '32nd', type: 'BOOL', value: true },
                        { name: '64th', type: 'BOOL', value: true },
                    ]
                },
                rangeTreble: {
                    name: 'Range Treble', type: 'RANGE', subsettings: [
                        { name: 'Low', type: 'NUMBER', value: -4 },
                        { name: 'High', type: 'NUMBER', value: 14 },
                    ]
                },
                rangeBass: {
                    name: 'Range Bass', type: 'RANGE', subsettings: [
                        { name: 'Low', type: 'NUMBER', value: -4 },
                        { name: 'High', type: 'NUMBER', value: 14 },
                    ]
                },
                rangeNotesPerStaff: {
                    name: 'Range number of notes per staff', type: 'RANGE', subsettings: [
                        { name: 'Low', type: 'NUMBER', value: 50 },
                        { name: 'High', type: 'NUMBER', value: 50 },
                    ]
                },
                rangeNumOfSimNotes: {
                    name: 'Range number of simultaneos notes', type: 'RANGE', subsettings: [
                        { name: 'Low', type: 'NUMBER', value: 1 },
                        { name: 'High', type: 'NUMBER', value: 5 },
                    ]
                },
                rangeBeamLength: {
                    name: 'Range number of notes connected by beams', type: 'RANGE', subsettings: [
                        { name: 'Low', type: 'NUMBER', value: 150 },
                        { name: 'High', type: 'NUMBER', value: 150 },
                    ]
                },
                accidentals: {
                    name: 'Accidentals', type: 'FLAGS', subsettings: [
                        { name: 'Double-flat', type: 'BOOL', value: true },
                        { name: 'Flat', type: 'BOOL', value: true },
                        { name: 'Natural', type: 'BOOL', value: true },
                        { name: 'Sharp', type: 'BOOL', value: true },
                        { name: 'Double-Sharp', type: 'BOOL', value: true },
                    ]
                }
            }
        },
        rests: {
            type: 'Category', subsettings: {
                durations: {
                    name: 'Durations', type: 'FLAGS', subsettings: [
                        { name: 'Double-whole', type: 'BOOL', value: false },
                        { name: 'Whole', type: 'BOOL', value: true },
                        { name: 'Half', type: 'BOOL', value: true },
                        { name: 'Quarter', type: 'BOOL', value: true },
                        { name: '8th', type: 'BOOL', value: true },
                        { name: '16th', type: 'BOOL', value: true },
                        { name: '32nd', type: 'BOOL', value: true },
                        { name: '64th', type: 'BOOL', value: true },
                    ]
                },
                rangeRestsPerStaff: {
                    name: 'Range number of rests per staff', type: 'RANGE', subsettings: [
                        { name: 'Low', type: 'NUMBER', value: 20 },
                        { name: 'High', type: 'NUMBER', value: 150 },
                    ]
                },
            }
        },
        barlineOccurence: { type: 'PROBABILITY', value: 0.3 },
        repeatSignOccurence: { type: 'FLAG', value: true },
    },
}