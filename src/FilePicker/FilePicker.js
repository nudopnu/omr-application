import { React, useRef } from 'react';
import { Spinner } from '../Spinner/Spinner';
import "./FilePicker.css"

export function FilePicker(props) {
    const inp = useRef(null);

    function handleClick() {
        inp.current.click();
    }

    function handleChange(e) {
        props.onFilesReceive(e.target.files);
    }


    return (
        <div id="drop-area" >
            <div id="instructions">
                {
                    (!props.loading &&
                        <>
                            <span>Drop Sheet Here</span>
                            <button onClick={handleClick} className="choose">or choose from file...</button>
                            <input type="file" name="sheet" id="file-input" ref={inp} onChange={handleChange} accept="image/png, image/jpeg" />
                        </>
                    ) ||
                    <Spinner text={"Loading image..."} />
                }
            </div>
        </div>
    );
}
