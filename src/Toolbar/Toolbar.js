import { useState } from 'react';
import { ModelPicker } from './ModelPicker/ModelPicker';
import './Toolbar.css'

export function Toolbar({ canvas }) {

    const [isPredicting, setPredicting] = useState(false);

    function onRequestPrediction(modelName) {
        setPredicting(true);
        (async () => {
            let res = await window.python.predict(modelName, canvas.toDataURL());
            console.log(res);
            setPredicting(false);
            alert(res)
        })();
    }

    return (
        <div id="toolbar">
            <ModelPicker onRequestPrediction={onRequestPrediction} isPredicting={isPredicting} />
            <hr className="divider" />
        </div>
    );
}