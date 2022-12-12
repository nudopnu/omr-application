import React from 'react';
import './Job.css';

export interface IJob {
    name: string;
    state: JobState;
    run: () => Promise<any>;
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
}

export class ConversionJob implements IJob {
    constructor(
        public name: string,
        public run: () => Promise<any>,
        public state = 'Default' as JobState,
    ) { }

}

export function Job({ job, requestRemoval, onStateChange }: JobProps) {

    async function onClickRun() {
        job.state = 'Running';
        try {
            await job.run();
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