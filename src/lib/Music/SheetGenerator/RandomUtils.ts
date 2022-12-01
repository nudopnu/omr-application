export class RandomUtils {

    static randInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    static take<T>(list: T[], k: number, sortIdcs = false, pad = 0): T[] {
        let idcs = list.map((_, idx) => idx);
        if (pad) {
            idcs = idcs.slice(pad, idcs.length - pad);
        }
        idcs = RandomUtils.shuffle(idcs);
        const targetIdcs = idcs.slice(0, k);
        if (sortIdcs) {
            targetIdcs.sort((a, b) => a - b);
            console.log(targetIdcs);
        }
        return targetIdcs
            .map(idx => list[idx]);
    }

    static takeSingle<T>(list: T[]): T {
        return list[Math.floor(Math.random() * list.length)];
    }

    static takeIntervalRange<T>(list: T[], min = 1, max?: number) {
        if (!max) max = list.length;
        let interval = RandomUtils.randInt(min, max);
        return RandomUtils.takeInterval(list, interval);
    }

    static takeInterval<T>(list: T[], interval: number) {
        const idxA = RandomUtils.randInt(0, list.length - interval)
        const idxB = idxA + interval;
        return [list[idxA], list[idxB]]
    }

    static shuffle<T>(list: T[]): T[] {
        // Taken from: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
        list = [...list];
        let j, x, i;
        for (i = list.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = list[i];
            list[i] = list[j];
            list[j] = x;
        }
        return list;
    }
}