import { IJob, JobState } from "./Job";

export const ConversionJobSettingTypes = [
    "PDF",
    "PNG",
    "BOUNDING_BOX",
] as const;

export type ConversionJobSettingType = typeof ConversionJobSettingTypes[number];

export type ConversionJobSettings = { [key in ConversionJobSettingType]: { enabled: boolean, limParallel?: number } };

export class ConversionJob implements IJob {
    constructor(
        public name: string,
        public run: (settings: ConversionJobSettings) => Promise<any>,
        public state = 'Default' as JobState,
    ) { }
}