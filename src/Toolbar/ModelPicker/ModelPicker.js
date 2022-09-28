import { useEffect, useState } from "react";
import './ModelPicker.css'

export function ModelPicker({ onRequestPrediction }) {
    const [modelList, setModelList] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);

    /* on load */
    useEffect(() => {
        (async () => {
            const res = await window.python.getModels();
            console.log(res);
            setModelList(res)
            setSelectedModel(res[0])
        })()
    }, [])

    function onModelSelect(selection) {
        setSelectedModel(selection);
    }

    function onPredict() {
        onRequestPrediction(selectedModel)
    }

    return (
        <div id="mp-container">
            <span>Pick a model:</span>
            <div id="list">
                {modelList && modelList.map(name =>
                    <span
                        key={name}
                        className={`entry${name === selectedModel ? " selected" : ""}`}
                        onClick={_ => onModelSelect(name)}
                    >
                        {name}
                    </span>
                )}
            </div>
            <button onClick={onPredict}>Predict Classes</button>
        </div>
    );
}