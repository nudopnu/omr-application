import React from 'react';
import { Utils } from '../Utils';
import { ConversionJobSettings, ConversionJobSettingType, ConversionJobSettingTypes } from './ConversionJob';
import { IJob, Job } from './Job';

interface JobListProps {
    jobs?: IJob[];
}

const initialSettings: ConversionJobSettings = {
    PDF: {
        enabled: true,
    },
    PNG: {
        enabled: false,
        limParallel: 3,
    },
    BOUNDING_BOX: {
        enabled: false,
    }
};

export function JobList({ jobs = [] }: JobListProps = {}) {
    const [, updateState] = React.useState({});
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [settings, updateSettings] = React.useState<ConversionJobSettings>(initialSettings);

    function toggleSetting(type: ConversionJobSettingType) {
        const newSettings = { ...settings };
        newSettings[type].enabled = !newSettings[type].enabled;
        updateSettings(newSettings);
    }

    return (
        <>
            {
                jobs.map((job, idx) => (
                    <Job
                        key={idx}
                        job={job}
                        requestRemoval={() => remove(idx)}
                        onStateChange={console.log}
                        settings={settings}
                    />
                ))
            }
            <div style={{ "display": "flex", "alignItems": "center" }}>
                {ConversionJobSettingTypes.map((type, idx) => (
                    <span onClick={() => toggleSetting(type)} style={{ "cursor": "pointer" }} key={idx}>
                        <input type="checkbox" checked={settings[type].enabled} style={{ "cursor": "pointer" }} readOnly={true} />
                        <span style={{ "fontSize": "small" }}>{Utils.toDisplayName(type)}</span>
                    </span>
                ))}
            </div>
            <button onClick={onRunAllJobs}>Run all jobs</button>
        </>
    );

    async function onRunAllJobs() {
        for (let i = 0; i < jobs.length; i++) {
            const job = jobs[i];
            job.state = 'Running';
            forceUpdate();
            try {
                await job.run(settings);
                job.state = 'Done';
                forceUpdate();
            } catch (error) {
                job.state = 'Error';
                forceUpdate();
            }
        }
    }

    function remove(idx: number): void {
        jobs = jobs.splice(idx, 1);
        forceUpdate();
    }
}