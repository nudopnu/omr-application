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
        <div id="container">
            {modelList && modelList.map(name =>
                <span key={name} className="entry">{name}</span>
            )}
        </div>
    );
}