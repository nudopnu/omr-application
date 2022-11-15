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

    private constructor(
        public staffs: Staff[] = [],
    ) { }

    getStaff(idx = 0): Staff {
        return this.staffs[idx];
    }
}