import { AbcjsElementType } from "./AbcjsElementTypes"
import { Selector, DefaultSelector, AspectRatioSelector, HairpinSelector, InnerHTMLSelector, TimeSigSelector, RelativeWidthSelector } from "./Selector";

interface AbcjsElement {
    id: number;
    selector: Selector;
    colors: string[];
};

export const AbcjsElements: { [key in AbcjsElementType]: AbcjsElement | undefined } = {
    Brace: { id: 1, selector: new DefaultSelector('.abcjs-brace'), colors: ['#000000', '#8C3BFF'] },
    LedgerLine: { id: 2, selector: new DefaultSelector('.abcjs-ledger'), colors: ['#000000', '#018700'] },
    RepeatDot: { id: 3, selector: new DefaultSelector('.abcjs-bar > [data-name="dots.dot"]'), colors: ['#000000', '#FFA52F'] },
    Segno: { id: 4, selector: new DefaultSelector('[data-name="scripts.segno"]'), colors: ['#000000', '#573B00'] },
    Coda: { id: 5, selector: new DefaultSelector('[data-name="scripts.coda"]'), colors: ['#000000', '#005659'] },
    ClefG: { id: 6, selector: new DefaultSelector('[data-name="clefs.G"]'), colors: ['#000000', '#0000DD'] },
    ClefC: { id: 7, selector: new DefaultSelector('[data-name="clefs.C"]'), colors: ['#000000', '#00FDCF'] },
    ClefF: { id: 9, selector: new DefaultSelector('[data-name="clefs.F"]'), colors: ['#000000', '#BCB6FF'] },
    ClefUnpitchedPercussion: { id: 10, selector: new DefaultSelector('[data-name="clefs.perc"]'), colors: ['#00000', '#95B577'] },
    Clef8: { id: 11, selector: new DefaultSelector('.abcjs-clef > [data-name="8"]'), colors: ['#000000', '#FDF490'] },
    TimeSig0: { id: 13, selector: new TimeSigSelector('.abcjs-time-signature path', 0), colors: ['#000000', '#8E7900'] },
    TimeSig1: { id: 14, selector: new TimeSigSelector('.abcjs-time-signature path', 1), colors: ['#000000', '#FF7266'] },
    TimeSig2: { id: 15, selector: new TimeSigSelector('.abcjs-time-signature path', 2), colors: ['#000000', '#EDB8B8'] },
    TimeSig3: { id: 16, selector: new TimeSigSelector('.abcjs-time-signature path', 3), colors: ['#000000', '#5D7E66'] },
    TimeSig4: { id: 17, selector: new TimeSigSelector('.abcjs-time-signature path', 4), colors: ['#000000', '#9AE4FF'] },
    TimeSig5: { id: 18, selector: new TimeSigSelector('.abcjs-time-signature path', 5), colors: ['#000000', '#EB0077'] },
    TimeSig6: { id: 19, selector: new TimeSigSelector('.abcjs-time-signature path', 6), colors: ['#000000', '#A57BB8'] },
    TimeSig7: { id: 20, selector: new TimeSigSelector('.abcjs-time-signature path', 7), colors: ['#000000', '#5900A3'] },
    TimeSig8: { id: 21, selector: new TimeSigSelector('.abcjs-time-signature path', 8), colors: ['#000000', '#03C600'] },
    TimeSig9: { id: 22, selector: new TimeSigSelector('.abcjs-time-signature path', 9), colors: ['#000000', '#9E4B00'] },
    TimeSigCommon: { id: 23, selector: new DefaultSelector('[data-name="timesig.common"]'), colors: ['#000000', '#708297'] },
    TimeSigCutCommon: { id: 24, selector: new DefaultSelector('[data-name="timesig.cut"]'), colors: ['#000000', '#00AF89'] },
    NoteheadBlack: { id: 25, selector: new DefaultSelector('.abcjs-note:not(.abcjs-d0-5, .abcjs-d1, .abcjs-d2) > :not([data-name*="."], [class])'), colors: ['#000000', '#8287FF'] },
    NoteheadHalf: { id: 29, selector: new DefaultSelector('.abcjs-note.abcjs-d0-5 > :not([data-name*="."], [class])'), colors: ['#000000', '#BDE6BF'] },
    NoteheadWhole: { id: 33, selector: new DefaultSelector('.abcjs-note.abcjs-d1 > :not([data-name*="."], [class])'), colors: ['#000000', '#2F5282'] },
    NoteheadDoubleWhole: { id: 37, selector: new DefaultSelector('.abcjs-note.abcjs-d2 > :not([data-name*="."], [class])'), colors: ['#000000', '#038287'] },
    AugmentationDot: { id: 41, selector: new DefaultSelector('.abcjs-note >[data-name="dots.dot"]'), colors: ['#000000', '#4D33FF'] },
    Stem: { id: 42, selector: new DefaultSelector('.abcjs-stem'), colors: ['#000000', '#85A301'] },
    Flag8thUp: { id: 48, selector: new DefaultSelector('[data-name="flags.u8th"]'), colors: ['#000000', '#00D6D4'] },
    Flag16thUp: { id: 50, selector: new DefaultSelector('[data-name*="flags.u16th"]'), colors: ['#000000', '#F9FF00'] },
    Flag32ndUp: { id: 51, selector: new DefaultSelector('[data-name*="flags.u32nd"]'), colors: ['#000000', '#6967AF'] },
    Flag64thUp: { id: 52, selector: new DefaultSelector('[data-name*="flags.u64th"]'), colors: ['#000000', '#C39700'] },
    Flag8thDown: { id: 54, selector: new DefaultSelector('[data-name="flags.d8th"]'), colors: ['#000000', '#DA95FF'] },
    Flag16thDown: { id: 56, selector: new DefaultSelector('[data-name="flags.d16th"]'), colors: ['#000000', '#915282'] },
    Flag32ndDown: { id: 57, selector: new DefaultSelector('[data-name="flags.d32nd"]'), colors: ['#000000', '#A00072'] },
    Flag64thDown: { id: 58, selector: new DefaultSelector('[data-name="flags.d64th"]'), colors: ['#000000', '#569A54'] },
    AccidentalFlat: { id: 60, selector: new DefaultSelector('.abcjs-note > [data-name="accidentals.flat"]'), colors: ['#000000', '#364426'] },
    AccidentalNatural: { id: 62, selector: new DefaultSelector('.abcjs-note > [data-name="accidentals.nat"]'), colors: ['#000000', '#8E8C5E'] },
    AccidentalSharp: { id: 64, selector: new DefaultSelector('.abcjs-note > [data-name="accidentals.sharp"]'), colors: ['#000000', '#C8FFF9'] },
    AccidentalDoubleSharp: { id: 66, selector: new DefaultSelector('.abcjs-note > [data-name*="accidentals.dblsharp"]'), colors: ['#000000', '#6ECFA7'] },
    AccidentalDoubleFlat: { id: 67, selector: new DefaultSelector('.abcjs-note > [data-name*="accidentals.dblflat"]'), colors: ['#000000', '#BFFF8C'] },
    KeyFlat: { id: 68, selector: new DefaultSelector('.abcjs-staff-extra > [data-name="accidentals.flat"]'), colors: ['#000000', '#8C54B1'] },
    KeyNatural: { id: 69, selector: new DefaultSelector('.abcjs-staff-extra > [data-name="accidentals.nat"]'), colors: ['#000000', '#773618'] },
    KeySharp: { id: 70, selector: new DefaultSelector('.abcjs-staff-extra > [data-name="accidentals.sharp"]'), colors: ['#000000', '#FFA079'] },
    ArticStaccatoBelow: { id: 74, selector: new DefaultSelector('[data-name="scripts.staccato"]'), colors: ['#000000', '#679793'] },
    ArticTenutoBelow: { id: 76, selector: new DefaultSelector('[data-name="scripts.tenuto"]'), colors: ['#000000', '#4B6774'] },
    ArticMarcatoAbove: { id: 79, selector: new DefaultSelector('[data-name="scripts.umarcato"]'), colors: ['#000000', '#01CFFD'] },
    FermataAbove: { id: 81, selector: new DefaultSelector('[data-name="scripts.ufermata"]'), colors: ['#000000', '#60345D'] },
    FermataBelow: { id: 82, selector: new DefaultSelector('[data-name="scripts.dfermata"]'), colors: ['#000000', '#90D42F'] },
    RestWhole: { id: 85, selector: new DefaultSelector('[data-name="rests.whole"]'), colors: ['#000000', '#FFCD44'] },
    RestHalf: { id: 86, selector: new DefaultSelector('[data-name="rests.half"]'), colors: ['#000000', '#8201CF'] },
    RestQuarter: { id: 87, selector: new DefaultSelector('[data-name="rests.quarter"]'), colors: ['#000000', '#4DFDFF'] },
    Rest8th: { id: 88, selector: new DefaultSelector('[data-name="rests.8th"]'), colors: ['#000000', '#89003D'] },
    Rest16th: { id: 89, selector: new DefaultSelector('[data-name="rests.16th"]'), colors: ['#000000', '#7B525B'] },
    Rest32nd: { id: 90, selector: new DefaultSelector('[data-name="rests.32nd"]'), colors: ['#000000', '#00749C'] },
    Rest64th: { id: 91, selector: new DefaultSelector('[data-name="rests.64th"]'), colors: ['#000000', '#AA8297'] },
    DynamicP: { id: 94, selector: new AspectRatioSelector('.abcjs-dynamics > path, path.abcjs-dynamics[d*="c"]', 1.119), colors: ['#000000', '#E400E2'] },
    DynamicM: { id: 95, selector: new AspectRatioSelector('.abcjs-dynamics > path, path.abcjs-dynamics[d*="c"]', 1.609), colors: ['#000000', '#B8B68A'] },
    DynamicF: { id: 96, selector: new AspectRatioSelector('.abcjs-dynamics > path, path.abcjs-dynamics[d*="c"]', 0.830), colors: ['#000000', '#382D00'] },
    DynamicS: { id: 97, selector: new AspectRatioSelector('.abcjs-dynamics > path, path.abcjs-dynamics[d*="c"]', 0.757), colors: ['#000000', '#E27EA3'] },
    DynamicZ: { id: 98, selector: new AspectRatioSelector('.abcjs-dynamics > path, path.abcjs-dynamics[d*="c"]', 0.980), colors: ['#000000', '#AC3B2F'] },
    OrnamentTrill: { id: 104, selector: new DefaultSelector('[data-name="scripts.trill"]'), colors: ['#000000', '#0054C1'] },
    OrnamentTurn: undefined, // { id: 105, selector: new DefaultSelector(''), colors: ['#000000', '#AC93EB'] },
    OrnamentMordent: { id: 107, selector: new DefaultSelector('[data-name="scripts.mordent"]'), colors: ['#000000', '#5E3A80'] },
    StringsDownBow: { id: 108, selector: new DefaultSelector('[data-name="scripts.downbow"]'), colors: ['#000000', '#004B33'] },
    StringsUpBow: { id: 109, selector: new DefaultSelector('[data-name="scripts.upbow"]'), colors: ['#000000', '#7CB8D3'] },
    Arpeggiato: { id: 110, selector: new DefaultSelector('[data-name="scripts.arpeggio"]'), colors: ['#000000', '#972A00'] },
    Tuplet3: { id: 113, selector: new DefaultSelector('.abcjs-triplet > text[data-name="3"]'), colors: ['#000000', '#FF803D'] },
    Tuplet6: { id: 114, selector: new DefaultSelector('.abcjs-triplet > text[data-name="6"]'), colors: ['#000000', '#FFD1E8'] },
    Fingering0: { id: 115, selector: new InnerHTMLSelector('text.abcjs-annotation > tspan', '0'), colors: ['#000000', '#802F59'] },
    Fingering1: { id: 116, selector: new InnerHTMLSelector('text.abcjs-annotation > tspan', '1'), colors: ['#000000', '#213400'] },
    Fingering2: { id: 117, selector: new InnerHTMLSelector('text.abcjs-annotation > tspan', '2'), colors: ['#000000', '#A15D6E'] },
    Fingering3: { id: 118, selector: new InnerHTMLSelector('text.abcjs-annotation > tspan', '3'), colors: ['#000000', '#4FB5AF'] },
    Fingering4: { id: 119, selector: new InnerHTMLSelector('text.abcjs-annotation > tspan', '4'), colors: ['#000000', '#9E9E46'] },
    Fingering5: { id: 120, selector: new InnerHTMLSelector('text.abcjs-annotation > tspan', '5'), colors: ['#000000', '#337C3D'] },
    Slur: { id: 121, selector: new DefaultSelector('.abcjs-slur'), colors: ['#000000', '#C6E83D'] },
    Beam: { id: 122, selector: new DefaultSelector('.abcjs-beam-elem'), colors: ['#000000', '#6B05E8'] },
    Tie: { id: 123, selector: new DefaultSelector('.abcjs-tie'), colors: ['#000000', '#75BC4F'] },
    RestHBar: { id: 124, selector: new DefaultSelector('[data-name="rests.multimeasure"]'), colors: ['#000000', '#4F6993'] },
    DynamicCrescendoHairpin: { id: 125, selector: new HairpinSelector('path.abcjs-dynamics:not([d*="c"])', false), colors: ['#000000', '#856DE1'] },
    DynamicDiminuendoHairpin: { id: 126, selector: new HairpinSelector('path.abcjs-dynamics:not([d*="c"])', true), colors: ['#000000', '#C16E72'] },
    Tuplet2: { id: 128, selector: new DefaultSelector('.abcjs-triplet > text[data-name="2"]'), colors: ['#00000', '#D88E38'] },
    Tuplet4: { id: 129, selector: new DefaultSelector('.abcjs-triplet > text[data-name="4"]'), colors: ['#000000', '#FB7CFF'] },
    Tuplet5: { id: 130, selector: new DefaultSelector('.abcjs-triplet > text[data-name="5"]'), colors: ['#000000', '#4B6449'] },
    Tuplet7: { id: 131, selector: new DefaultSelector('.abcjs-triplet > text[data-name="7"]'), colors: ['#000000', '#D6C3EB'] },
    Tuplet8: { id: 132, selector: new DefaultSelector('.abcjs-triplet > text[data-name="8"]'), colors: ['#000000', '#792D36'] },
    Tuplet9: { id: 133, selector: new DefaultSelector('.abcjs-triplet > text[data-name="9"]'), colors: ['#000000', '#4B8EA5'] },
    TupletBracket: { id: 134, selector: new DefaultSelector('.abcjs-triplet > path'), colors: ['#000000', '#4687FF'] },
    Staff: { id: 135, selector: new DefaultSelector('.abcjs-staff'), colors: ['#000000', '#9E90AF'] },
    BarLine: { id: 137, selector: new RelativeWidthSelector('g:not([class]) > path:not([class], [data-name]), [data-name="bar"] > path', 0.00077), colors: ['#000000', '#00ACC6'] },
    BarLineThick: { id: 138, selector: new RelativeWidthSelector('[data-name="bar"]', 0.0051), colors: ['#000000', '#97FF00'] },
    Flag128thUp: undefined, // { id: 53, selector: new DefaultSelector(''), colors: ['#000000', '#E1CD9C'] },
    Flag128thDown: undefined, // { id: 59, selector: new DefaultSelector(''), colors: ['#000000', '#D38C8E'] },
    AccidentalFlatSmall: undefined, // { id: 61, selector: new DefaultSelector(''), colors: ['#0000'] },
    AccidentalNaturalSmall: undefined, // { id: 63, selector: new DefaultSelector(''), colors: ['#0000'] },
    AccidentalSharpSmall: undefined, // { id: 65, selector: new DefaultSelector(''), colors: ['#0000'] },
    ArticAccentAbove: undefined, // { id: 71, selector: new DefaultSelector(''), colors: ['#000000', '#A8001F'] },
    ArticAccentBelow: undefined, // { id: 72, selector: new DefaultSelector('[data-name="scripts.staccato"]'), colors: ['#000000', '#FF1C44'] },
    ArticStaccatoAbove: undefined, // { id: 73, selector: new DefaultSelector(''), colors: ['#000000', '#5E1123'] },
    ArticTenutoAbove: undefined, // { id: 75, selector: new DefaultSelector(''), colors: ['#000000', '#FF5E93'] },
    ArticStaccatissimoAbove: undefined, // { id: 77, selector: new DefaultSelector(''), colors: ['#000000', '#5291CC'] },
    ArticStaccatissimoBelow: undefined, // { id: 78, selector: new DefaultSelector(''), colors: ['#000000', '#AA7031'] },
    ArticMarcatoBelow: undefined, // { id: 80, selector: new DefaultSelector(''), colors: ['#000000', '#00C36B'] },
    Caesura: undefined, // { id: 83, selector: new DefaultSelector(''), colors: ['#000000', '#BFD47C'] },
    RestDoubleWhole: undefined, // { id: 84, selector: new DefaultSelector(''), colors: ['#000000', '#7C5900'] },
    Rest128th: undefined, // { id: 92, selector: new DefaultSelector(''), colors: ['#000000', '#80708E'] },
    RestHNr: { id: 93, selector: new DefaultSelector('text.abcjs-rest > tspan'), colors: ['#0000', '#C14100'] },
    DynamicR: undefined, // { id: 99, selector: new DefaultSelector(''), colors: ['#000000', '#A8BA4B'] },
    GraceNoteAcciaccaturaStemUp: undefined, // { id: 100, selector: new DefaultSelector(''), colors: ['#0000'] },
    GraceNoteAppoggiaturaStemUp: undefined, // { id: 101, selector: new DefaultSelector(''), colors: ['#0000'] },
    GraceNoteAcciaccaturaStemDown: undefined, // { id: 102, selector: new DefaultSelector(''), colors: ['#0000'] },
    GraceNoteAppoggiaturaStemDown: undefined, // { id: 103, selector: new DefaultSelector(''), colors: ['#0000'] },
    OrnamentTurnInverted: undefined, // { id: 106, selector: new DefaultSelector(''), colors: ['#0000'] },
    KeyboardPedalPed: undefined, // { id: 111, selector: new DefaultSelector(''), colors: ['#000000', '#386E64'] },
    KeyboardPedalUp: undefined, // { id: 112, selector: new DefaultSelector(''), colors: ['#000000', '#B8005B'] },
    Clef15: undefined, //{ id: 12, selector: new DefaultSelector(''), colors: ['#000000', '#004B00'] },
    Tremolo1: undefined, // { id: 43, selector: new DefaultSelector(''), colors: ['#000000', '#FD03CA'] },
    Tremolo2: undefined, // { id: 44, selector: new DefaultSelector(''), colors: ['#000000', '#C1A5C4'] },
    Tremolo3: undefined, // { id: 45, selector: new DefaultSelector(''), colors: ['#000000', '#C45646'] },
    Tremolo4: undefined, // { id: 46, selector: new DefaultSelector(''), colors: ['#000000', '#75573D'] },
    Tremolo5: undefined, // { id: 47, selector: new DefaultSelector(''), colors: ['#0000'] },
    Flag8thUpSmall: undefined, // { id: 49, selector: new DefaultSelector(''), colors: ['#0000'] },
    Flag8thDownSmall: undefined, // { id: 55, selector: new DefaultSelector(''), colors: ['#0000'] },
    Tuplet1: undefined, // { id: 127, selector: new DefaultSelector(''), colors: ['#0000'] },
    OttavaBracket: undefined, // { id: 136, selector: new DefaultSelector(''), colors: ['#000000', '#57502A'] },
};