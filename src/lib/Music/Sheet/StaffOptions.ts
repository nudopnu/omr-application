import { Meter } from "../AbcUtils/Meter";
import { Clef } from "./Clef";
import { KeySignature } from "./KeySignature";

export interface StaffOptions {
    clef?: Clef,
    key?: KeySignature,
    meter?: Meter,
}