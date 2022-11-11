import { AnyKeyPitch } from "../KeyPitch";
import { ModeType, ModeTypes } from "../Mode";
import { Note } from "../Note";

export class KeySignature {

    intervals: number[];
    relativeMidis: number[];

    constructor(
        public key: AnyKeyPitch,
        public mode: ModeType = 'Ionian',
    ) {
        let intervals = [2, 2, 1, 2, 2, 2, 1];
        let offset = ModeTypes.indexOf(mode);
        this.intervals = [...intervals.slice(offset), ...intervals.slice(0, offset)];

        let tmp = 0;
        this.relativeMidis = [0, ...this.intervals.map(interval => (tmp += interval))];
    }

    toScale(octave: number, duration: number, notes = 8): Note[] {
        let tmp = 0;
        return [0,
            ...[...Array(notes - 1).keys()].map(idx => tmp += this.intervals[idx % 7])
        ].map(relativeMidi => ({
            midi: relativeMidi + octave * 12,
            duration: duration,
        } as Note));
    }

}