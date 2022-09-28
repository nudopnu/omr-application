import { useEffect } from 'react';
import { ModelPicker } from './ModelPicker/ModelPicker';
import './Toolbar.css'

export function Toolbar({ canvas }) {
    function onRequestPrediction() {
        // console.log(canvas.toDataURL(), window.python);
        (async () => {
            let res = await window.python.predict(canvas.toDataURL());
            console.log("hä?",res);
            alert(res)
        })();
    }

    useEffect(() => {
        (async () => {
            const res = await window.python.getModels();
            // const res2 = await window.python.predict();
            console.log(res);
        })()
    }, [])

    return (
        <div id="toolbar">
            <ModelPicker onRequestPrediction={onRequestPrediction} />
            <hr className="divider" />
        </div>
    );
}