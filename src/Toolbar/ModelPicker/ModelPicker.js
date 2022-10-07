import { useEffect, useState } from "react";
import { List } from "../../common/List";
import { Spinner } from "../../Spinner/Spinner";
import './ModelPicker.css'

export function ModelPicker({ onModelSelect, onRequestPrediction, isModelLoaded, isPredicting }) {
    const [modelList, setModelList] = useState(null);
    const [hasInit, setHasInit] = useState(false);

    /* on load */
    useEffect(() => {
        (async () => {
            if (hasInit)
                return;
            setHasInit(true);
            console.log("Starting because", hasInit);
            await window.predict.start();
            const modelnames = await window.python.getModels();
            setModelList(modelnames);
        })()
    }, [])

    return (
        <div id="mp-container">
            <span>Pick a model:</span>
            <List items={modelList} onSelect={onModelSelect} />
            {
                (isPredicting && <Spinner text={"Predicting..."} />) ||
                (isModelLoaded && <button onClick={_ => onRequestPrediction()}>Predict Classes</button>)
            }
        </div>
    );
}