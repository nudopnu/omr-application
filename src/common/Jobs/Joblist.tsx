import React from 'react';
import { IJob, Job } from './Job';

interface JobListProps {
    jobs?: IJob[];
}

export function JobList({ jobs = [] }: JobListProps) {
    const [, updateState] = React.useState({});
    const forceUpdate = React.useCallback(() => updateState({}), []);

    return (
        <>
            {
                jobs.map((job, idx) => (
                    <Job
                        key={idx}
                        job={job}
                        requestRemoval={() => remove(idx)}
                        onStateChange={console.log}
                    />
                ))
            }
            <button onClick={onRunAllJobs}>Run all jobs</button>
        </>
    );

    function onRunAllJobs() {
        jobs.forEach(async job => {
            job.state = 'Running';
            forceUpdate();
            try {
                await job.run();
                job.state = 'Done';
                forceUpdate();
            } catch (error) {
                job.state = 'Error';
                forceUpdate();
            }
        });
    }

    function remove(idx: number): void {
        jobs = jobs.splice(idx, 1);
        forceUpdate();
    }
}