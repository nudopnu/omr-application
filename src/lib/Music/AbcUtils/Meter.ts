export const MeterTypes = [
    'none',
    'C',
    'C|',
    'fraction',
] as const;

export type MeterType = typeof MeterTypes[number];



export class Meter implements Meter {

    static fromType(type: MeterType, a?: number | string, b?: number | string): Meter {
        if (type === 'C') {
            a = 4;
            b = 4;
        }
        else if (type === 'C|') {
            a = 2;
            b = 2;
        }
        return new Meter(type, a!, b!);
    }

    private constructor(
        public type: MeterType,
        public a: number | string,
        public b: number | string,
    ) { }

    toAbcString(): string {
        if (this.type === 'C' || this.type === 'C|' || this.type === 'none') {
            return this.type;
        }
        return this.a + "/" + this.b;
    }
}