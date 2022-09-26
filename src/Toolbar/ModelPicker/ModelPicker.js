import { useEffect, useState } from "react";
import './ModelPicker.css'

export function ModelPicker() {
    const [modelList, setModelList] = useState(null);

    useEffect(() => {
        (async () => {
            const res = await window.classification.getModels();
            console.log(res);
            setModelList(res)
        })()
    }, [])


    return (
        <div id="mp-container">
            <span>Pick a model:</span>
            <div id="list">
                {modelList && modelList.map(name =>
                    <span key={name} className="entry">{name}</span>
                )}
            </div>
            <button>Predict Classes</button>
        </div>
    );
}