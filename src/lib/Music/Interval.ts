import { Note } from "./Note";

export const IntervalTypes = [
    'perfect-unison',
    'minor-second',
    'major-second',
    'minor-triad',
    'major-triad',
    'perfect-fourth',
    'perfect-fifth',
    'minor-sixth',
    'major-sixth',
    'minor-seventh',
    'major-seventh',
    'perfect-octave',
] as const;

export type IntervalType = typeof IntervalTypes[number];

export interface IInterval {
    value: number;
    name: IntervalType;
    short: string;
}

export class Interval {

    static fromType(type: IntervalType): Interval {
        return new Interval(IntervalTypes.indexOf(type));
    }

    stepFrom(note: Note): Note {
        return { ...note, midi: note.midi + this.interval } as Note;
    }

    private constructor(
        public interval,
    ) { }
}
