import { React, useRef } from 'react';
import "./FilePicker.css"

export function FilePicker(props) {
    const inp = useRef(null);

    function handleClick() {
        inp.current.click();
    }

    function handleChange(e) {
        console.log("HELLO", e.target.value.split("\\").slice(-1)[0]);
        console.log("HELLO", e.target.files);
        // this.props.onFilesReceive(files);
        props.onFilesReceive(e.target.files);
    }


    return (
        <div id="drop-area" >
            {!props.invisible &&
                <div id="instructions">
                    <span>Drop Sheet here or choose from</span>
                    <button onClick={handleClick}>here</button>
                    <input type="file" name="sheet" id="" ref={inp} onChange={handleChange} accept="image/png, image/jpeg" />
                </div>
            }
        </div>
    );
}
