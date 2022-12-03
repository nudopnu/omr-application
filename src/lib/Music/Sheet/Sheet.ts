import { ChordGlyph, GlyphWithDuration } from "./Glyph";
import { DefaultSheetOptions, SheetOptions } from "./SheetOptions";
import { Staff } from "./Staff";
import { System } from "./System";

export class Sheet {

    options: SheetOptions;

    constructor(
        public systems: System[] = [],
        options?: SheetOptions,
    ) {
        this.options = {
            ...DefaultSheetOptions,
            ...options,
        };
    }

    addSystem() {
        const system = System.ofType(this.options.systemType, this);
        this.systems.push(system);
        return system;
    }

    applyBars() {
        this.systems.forEach(system => system.applyBars());
    }

    getNotes(): ChordGlyph[] {
        return this.systems.flatMap(system => system.getNotes());
    }

    getStaffOf(chord: GlyphWithDuration): Staff {
        return this.systems
            .map(system => system.getStaffOf(chord))
            .filter(staff => staff !== undefined)[0];
    }

    getSystemOf(staff: Staff): System {
        return this.systems
            .filter(system => system.staffs.indexOf(staff) !== -1)[0];
    }
}

