import { useEffect, useState } from "react";
import './ModelPicker.css'

export function ModelPicker({ onRequestPrediction }) {
    const [modelList, setModelList] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);

    /* on load */
    useEffect(() => {
        (async () => {
            const modelnames = await window.python.getModels();
            const firstmodel = modelnames[0];
            setModelList(modelnames);
            setSelectedModel(firstmodel);
        })()
    }, [])

    return (
        <div id="mp-container">
            <span>Pick a model:</span>
            <div id="list">
                {modelList && modelList.map(name =>
                    <span
                        key={name}
                        className={`entry${name === selectedModel ? " selected" : ""}`}
                        onClick={_ => setSelectedModel(name)}
                    >
                        {name}
                    </span>
                )}
            </div>
            <button onClick={_ => onRequestPrediction(selectedModel)}>Predict Classes</button>
        </div>
    );
}