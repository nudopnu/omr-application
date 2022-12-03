import { Bar, BarType } from "./Bar";
import { ChordGlyph } from "./Glyph";
import { Sheet } from "./Sheet";
import { Staff } from "./Staff";

export const SystemTypes = [
    'single-staff',
    'grand-staff'
] as const;

export type SystemType = typeof SystemTypes[number];

/* Actual class definition */

export class System {

    static ofType(type: SystemType, sheet: Sheet) {
        const system = new System();

        switch (type) {
            case 'single-staff':
                return new System([new Staff(sheet)]);
            case 'grand-staff':
                return new System([new Staff(sheet), new Staff(sheet)]);
            default:
                break;
        }

        return system;
    }

    addBar(type: BarType = "DEFAULT"): Bar[] {
        return this.staffs.map(staff => staff.startNextBar(type));
    }

    private constructor(
        public staffs: Staff[] = [],
    ) { }

    getStaff(idx = 0): Staff {
        return this.staffs[idx];
    }

    applyBars(): void {
        this.staffs.forEach(staff => staff.applyBars());
    }

    getNotes(): ChordGlyph[] {
        return this.staffs.flatMap(staff => staff.getNotes())
    }

    getStaffOf(chord: ChordGlyph): Staff {
        return this.staffs.filter(staff => staff.indexOf(chord) !== undefined)[0];
    }
}