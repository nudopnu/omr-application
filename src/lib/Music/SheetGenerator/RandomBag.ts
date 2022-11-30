export const OccurenceTypes = [
    'each-once',
    'each-n-times',
    'one-of',
    'n-of',
] as const;

export type Occurence = typeof OccurenceTypes[number];

export interface Rule<T> {
    occurence: Occurence,
    items: T[];
    n?: number;
}

export class RandomBag<T> {
    rules: Rule<T>[] = [];
    items: T[] = [];
    currentIndex = 0;

    addItems(occurence: Occurence, items: T[], n?: number) {
        this.rules.push({ occurence: occurence, items: items, n: n });
    }

    generate(n: number) {
        /* Reset */
        this.items = [];
        this.currentIndex = 0;

        /* Single item focused rules */
        this.rules
            .filter(rule => rule.occurence === "each-n-times" || rule.occurence === "each-once")
            .forEach(rule => {
                let n = rule.occurence === "each-n-times" ? rule.n! : 1;
                rule.items.forEach(item => {
                    const repetitions = [...Array(n).keys()];
                    this.items.push(...repetitions.map(_ => item));
                });
            });

        /* Item group focused rules */
        this.rules
            .filter(rule => rule.occurence === 'n-of' || rule.occurence === 'one-of')
            .forEach(rule => {
                const n = rule.occurence === 'n-of' ? rule.n! : 1;
                this.items.push(...RandomBag.__take(rule.items, n));
            });

        this.items = RandomBag.__shuffle(this.items);
    }

    static __take<T>(list: T[], k: number, sortIdcs = false): T[] {
        const idcs = list.map((_, idx) => idx);
        RandomBag.__shuffle(idcs);
        const targetIdcs = idcs.slice(0, k);
        if (sortIdcs) {
            targetIdcs.sort((a, b) => a - b);
            console.log(targetIdcs);
        }
        return targetIdcs
            .map(idx => list[idx]);
    }

    static __takeSingle<T>(list: T[]): T {
        return list[Math.floor(Math.random() * list.length)];
    }

    static __takeInterval<T>(list: T[], min = 1, max?: number) {
        let aIdx = Math.floor(Math.random() * list.length);
        let posMax = max ? max : list.length - 1 - aIdx;
        let negMax = max ? max : aIdx;
        if (aIdx + posMax > list.length - 1) posMax = list.length - 1 - aIdx;
        if (aIdx - negMax < 0) negMax = aIdx;
        const sign = Math.floor(Math.random());
        if (sign) {
            let bIdx = aIdx + (Math.floor(Math.random() * posMax) + min);
            return [list[aIdx], list[bIdx]];
        } else {
            let bIdx = aIdx - (Math.floor(Math.random() * negMax) + min);
            return [list[aIdx], list[bIdx]];
        }
    }

    static __shuffle<T>(list: T[]) {
        // Taken from: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
        let j, x, i;
        for (i = list.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = list[i];
            list[i] = list[j];
            list[j] = x;
        }
        return list;
    }

    take(k: number): T[] {
        const result = this.items.slice(this.currentIndex, this.currentIndex + k);
        this.currentIndex += k;
        return result;
    }
}