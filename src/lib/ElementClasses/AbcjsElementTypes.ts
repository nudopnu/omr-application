export const AbcjsElementTypes = [
    'Brace',
    'LedgerLine',
    'RepeatDot',
    'Segno',
    'Coda',
    'ClefG',
    'ClefC',
    'ClefF',
    'ClefUnpitchedPercussion',
    'Clef8',
    'Clef15',
    'TimeSig0',
    'TimeSig1',
    'TimeSig2',
    'TimeSig3',
    'TimeSig4',
    'TimeSig5',
    'TimeSig6',
    'TimeSig7',
    'TimeSig8',
    'TimeSig9',
    'TimeSigCommon',
    'TimeSigCutCommon',
    'NoteheadBlack',
    'NoteheadHalf',
    'NoteheadWhole',
    'NoteheadDoubleWhole',
    'AugmentationDot',
    'Stem',
    'Tremolo1',
    'Tremolo2',
    'Tremolo3',
    'Tremolo4',
    'Tremolo5',
    'Flag8thUp',
    'Flag8thUpSmall',
    'Flag16thUp',
    'Flag32ndUp',
    'Flag64thUp',
    'Flag128thUp',
    'Flag8thDown',
    'Flag8thDownSmall',
    'Flag16thDown',
    'Flag32ndDown',
    'Flag64thDown',
    'Flag128thDown',
    'AccidentalFlat',
    'AccidentalFlatSmall',
    'AccidentalNatural',
    'AccidentalNaturalSmall',
    'AccidentalSharp',
    'AccidentalSharpSmall',
    'AccidentalDoubleSharp',
    'AccidentalDoubleFlat',
    'KeyFlat',
    'KeyNatural',
    'KeySharp',
    'ArticAccentAbove',
    'ArticAccentBelow',
    'ArticStaccatoAbove',
    'ArticStaccatoBelow',
    'ArticTenutoAbove',
    'ArticTenutoBelow',
    'ArticStaccatissimoAbove',
    'ArticStaccatissimoBelow',
    'ArticMarcatoAbove',
    'ArticMarcatoBelow',
    'FermataAbove',
    'FermataBelow',
    'Caesura',
    'RestDoubleWhole',
    'RestWhole',
    'RestHalf',
    'RestQuarter',
    'Rest8th',
    'Rest16th',
    'Rest32nd',
    'Rest64th',
    'Rest128th',
    'RestHNr',
    'DynamicP',
    'DynamicM',
    'DynamicF',
    'DynamicS',
    'DynamicZ',
    'DynamicR',
    'GraceNoteAcciaccaturaStemUp',
    'GraceNoteAppoggiaturaStemUp',
    'GraceNoteAcciaccaturaStemDown',
    'GraceNoteAppoggiaturaStemDown',
    'OrnamentTrill',
    'OrnamentTurn',
    'OrnamentTurnInverted',
    'OrnamentMordent',
    'StringsDownBow',
    'StringsUpBow',
    'Arpeggiato',
    'KeyboardPedalPed',
    'KeyboardPedalUp',
    'Tuplet3',
    'Tuplet6',
    'Fingering0',
    'Fingering1',
    'Fingering2',
    'Fingering3',
    'Fingering4',
    'Fingering5',
    'Slur',
    'Beam',
    'Tie',
    'RestHBar',
    'DynamicCrescendoHairpin',
    'DynamicDiminuendoHairpin',
    'Tuplet1',
    'Tuplet2',
    'Tuplet4',
    'Tuplet5',
    'Tuplet7',
    'Tuplet8',
    'Tuplet9',
    'TupletBracket',
    'Staff',
    'OttavaBracket',
    'BarLine',
    'BarLineThick',
] as const;

export type AbcjsElementType = typeof AbcjsElementTypes[number];