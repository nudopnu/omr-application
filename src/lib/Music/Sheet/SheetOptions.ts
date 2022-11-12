import { AbcMeter } from "../AbcUtils/AbcMeter";
import { KeySignature } from "./KeySignature";
import { SystemType } from "./System";

export interface SheetOptions {
    title?: string;
    meter: AbcMeter;
    unitNoteLength: number;
    defaultDuration?: number;
    key: KeySignature;
    systemType: SystemType;
}

export const DefaultSheetOptions: SheetOptions = {
    systemType: 'single-staff',
    key: new KeySignature('C'),
    meter: AbcMeter.fromType('none'),
    unitNoteLength: -3,
} as SheetOptions;