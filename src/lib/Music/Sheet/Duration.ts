import { Meter } from "../AbcUtils/Meter";

export class Duration {
    constructor(
        public meter: Meter,
    ) { }

    getRandomDurations(maxDurations?: number): number[] {
        const baseDurations = [5, 4, 3, 2, 1, -1, -2, -3];
        const startIndex = Math.log2(this.meter.b as number) - 1;
        const scope = baseDurations.length - startIndex;
        const startDuration = baseDurations[startIndex];
        let durations = [startDuration]

        function splitDurations(durations: number[], idx: number): number[] {
            const oldDuration = durations[idx];
            const newDuration = baseDurations[baseDurations.indexOf(oldDuration) + 1];
            if (oldDuration === undefined)
                return durations
            const newDurations = [
                newDuration,
                newDuration,
            ];
            return [
                ...durations.slice(0, idx),
                ...newDurations,
                ...durations.slice(idx + 1),
            ]
        }

        // do #range split operations
        const range = Math.floor(Math.random() * ((scope * scope + scope) / 2));
        for (let index = 0; index < range; index++) {
            const filteredDurations = durations.filter(duration => duration > baseDurations[baseDurations.length - 1])
            const rndFilteredIdx = Math.floor(Math.random() * filteredDurations.length);
            const idxMap = {};
            let tmpIdx = 0;
            for (let i = 0; i < durations.length; i++) {
                const duration = durations[i];
                if (duration > baseDurations[baseDurations.length - 1]) {
                    idxMap[tmpIdx++] = i;
                }
            }
            durations = splitDurations(filteredDurations, idxMap[rndFilteredIdx]);
            if (maxDurations && durations.length >= maxDurations)
                break;
        }
        return durations;
    }

    static modify(duration: number, modify: number) {
        const baseDurations = [5, 4, 3, 2, 1, -1, -2, -3];
        return baseDurations[baseDurations.indexOf(duration) - modify];
    }
}