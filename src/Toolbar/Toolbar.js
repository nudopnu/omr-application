import { ModelPicker } from './ModelPicker/ModelPicker';
import './Toolbar.css'

export function Toolbar({ canvas }) {
    function handleOnRequestPrediction(modelName) {
        console.log("REunnfn");
        (async () => {
            let res = await window.python.predict(modelName, canvas.toDataURL());
            console.log("hä?",res);
            alert(res)
        })();
    }

    return (
        <div id="toolbar">
            <ModelPicker onRequestPrediction={handleOnRequestPrediction} />
            <hr className="divider" />
        </div>
    );
}