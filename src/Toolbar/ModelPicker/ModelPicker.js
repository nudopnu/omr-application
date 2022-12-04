import { useEffect, useState } from "react";
import { List } from "../../common/List";
import { Spinner } from "../../common/Spinner/Spinner";
import './ModelPicker.css'

export function ModelPicker({ getImage, addLayer }) {
    /* State variables */
    const [hasInit, setHasInit] = useState(false);
    const [isLoadingModel, setLoadingModel] = useState(false);
    const [isPredicting, setPredicting] = useState(false);
    const [isModelLoaded, setIsModelLoaded] = useState(false);

    const [modelList, setModelList] = useState(null);

    async function onModelSelect(modelName) {
        console.log(modelName);

        setIsModelLoaded(false);
        setLoadingModel(true);
        await window.predict.sendCommand("loadModel", modelName);
        setIsModelLoaded(true);
        setLoadingModel(false);

        console.log("SETTING MODEL", modelName);
    }

    async function onRequestPrediction() {

        setPredicting(true);
        let res = await window.predict.sendCommand("predict", getImage());
        setPredicting(false);

        let dataUrl = "data:image/png;base64," + res.payload.slice(2, -1)
        console.log(dataUrl);

        const newLayer = {
            type: 'base64ImageUrl',
            name: 'Prediction',
            visible: true,
            src: dataUrl
        };
        addLayer(newLayer);
    }

    /* on load */
    useEffect(() => {
        (async () => {
            if (hasInit)
                return;
            setHasInit(true);
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
                (isLoadingModel && <Spinner text={"Loading Model..."} />) ||
                (isModelLoaded && <button onClick={_ => onRequestPrediction()}>Predict Classes</button>)
            }
        </div>
    );
}