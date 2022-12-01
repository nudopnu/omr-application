import { RandomUtils } from "./RandomUtils";

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
                this.items.push(...RandomUtils.take(rule.items, n));
            });

        this.items = RandomUtils.shuffle(this.items);
    }


    take(k: number): T[] {
        const result = this.items.slice(this.currentIndex, this.currentIndex + k);
        this.currentIndex += k;
        return result;
    }
}