import { DefaultSheetOptions, SheetOptions } from "./SheetOptions";
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

}

