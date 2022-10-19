import { useState } from "react";
import "./ColorPicker.css"

export function ColorPicker() {

    const [displayText, setDisplayText] = useState("- Drop Layer here -")
    const [titleText, setTitleText] = useState("Analyze colors:")

    function onDragOver(event) {
        event.preventDefault();
    }

    function onDrop(event) {
        let res = JSON.parse(event.dataTransfer.getData('text/json'));
        console.log(res);
        setTitleText(`${res.layer.name} colors:`);
    }

    return (
        <>
            <span>{titleText}</span>
            <div onDragOver={onDragOver} onDrop={onDrop} className="layerdrop">
                <span>{displayText}</span>
            </div>
        </>
    );
}