import { ModelPicker } from './ModelPicker/ModelPicker';
import './Toolbar.css'

export function Toolbar() {
    return (
        <div id="toolbar">
            <ModelPicker />
            <hr class="divider" />
        </div>
    );
}