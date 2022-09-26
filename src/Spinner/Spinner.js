import { ReactComponent as Spin } from '../spinner.svg'
import './Spinner.css'

export function Spinner({ text }) {
    return (
        <div id='container' >
            <Spin fill='white' id="spin" />
            <span>{text}</span>
        </div>
    );
}