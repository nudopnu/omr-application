import { Meter } from "../AbcUtils/Meter";
import { Clef } from "./Clef";
import { KeySignature } from "./KeySignature";
import { StyleType } from "./Style";

export interface StaffOptions {
    clef?: Clef,
    key?: KeySignature,
    meter?: Meter,
    style?: StyleType,
}