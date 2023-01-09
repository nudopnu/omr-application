import React from 'react';
import { ConversionJobSettings } from './ConversionJob';
import './Job.css';

export interface IJob {
    name: string;
    state: JobState;
    run: (settings: ConversionJobSettings) => Promise<any>;
}

export const JobStates = [
    'Default',
    'Pending',
    'Running',
    'Error',
    'Done',
    'Canceled',
] as const;

export type JobState = typeof JobStates[number];

interface JobProps {
    job: IJob;
    requestRemoval: () => void;
    onStateChange: (job) => void;
    settings: ConversionJobSettings;
}

export function Job({ job, requestRemoval, onStateChange, settings }: JobProps) {

    async function onClickRun() {
        job.state = 'Running';
        try {
            await job.run(settings);
        } catch (error) {
            job.state = 'Error';
        }
        job.state = 'Done';
    }

    return (
        <div className='job'>
            <span>{job.name} - {job.state}</span>
            {job.state === 'Default' && <button className='inline' onClick={onClickRun}>Run</button>}
            {job.state === 'Running' && <button className='inline'>Cancel</button>}
            <div className="lasyerselectdelete" onClick={requestRemoval}>
                X
            </div>
        </div>
    );
}