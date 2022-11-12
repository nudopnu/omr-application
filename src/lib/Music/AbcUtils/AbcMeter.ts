export const AbcMeterTypes = [
    'none',
    'C',
    'C|',
    'fraction',
] as const;

export type AbcMeterType = typeof AbcMeterTypes[number];



export class AbcMeter implements AbcMeter {

    static fromType(type: AbcMeterType, a?: number, b?: number): AbcMeter {
        if (type === 'C') {
            a = 4;
            b = 4;
        }
        else if (type === 'C|') {
            a = 2;
            b = 2;
        }
        return new AbcMeter(type, a!, b!);
    }

    private constructor(
        public type: AbcMeterType,
        public a: number,
        public b: number,
    ) { }

    toAbcString(): string {
        if (this.type === 'C' || this.type === 'C|' || this.type === 'none') {
            return this.type;
        }
        return this.a + "/" + this.b;
    }
}