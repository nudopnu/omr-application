import { Meter } from "../AbcUtils/Meter";
import { KeySignature } from "./KeySignature";
import { SystemType } from "./System";

export interface SheetOptions {
    title?: string;
    meter: Meter;
    unitNoteLength: number;
    defaultDuration?: number;
    key: KeySignature;
    systemType: SystemType;
}

export const DefaultSheetOptions: SheetOptions = {
    systemType: 'single-staff',
    key: new KeySignature('C'),
    meter: Meter.fromType('none'),
    unitNoteLength: -3,
} as SheetOptions;