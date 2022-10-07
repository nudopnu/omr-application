import { useEffect, useState } from "react";
import { List } from "../../common/List";
import { Spinner } from "../../Spinner/Spinner";
import './ModelPicker.css'

export function ModelPicker({ onModelSelect, onRequestPrediction, isPredicting }) {
    const [modelList, setModelList] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);

    /* on load */
    useEffect(() => {
        (async () => {
            // await window.predict.start();
            const modelnames = await window.python.getModels();
            setModelList(modelnames);
        })()
    }, [])

    return (
        <div id="mp-container">
            <span>Pick a model:</span>
            <List items={modelList} onSelect={onModelSelect} />
            {
                (isPredicting && <Spinner text={"Predicting..."}/>) ||
                (selectedModel && <button onClick={_ => onRequestPrediction()}>Predict Classes</button>)
            }
        </div>
    );
}