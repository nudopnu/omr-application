import { KeySignature } from "./KeySignature";
import { SystemType } from "./System";

export interface SheetOptions {
    title?: string;
    metric?: string;
    defaultDuration?: number;
    key: KeySignature;
    systemType: SystemType;
}

export const DefaultSheetOptions: SheetOptions = {
    systemType: 'single-staff',
    key: new KeySignature('C'),
} as SheetOptions;