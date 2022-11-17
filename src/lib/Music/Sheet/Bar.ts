import { Duration } from "./Duration";


export const BarTypes = [
    "DEFAULT",
    ""
] as const;

export class Bar {
    constructor(
        public durations: Duration[] = [],
    ) { }
}