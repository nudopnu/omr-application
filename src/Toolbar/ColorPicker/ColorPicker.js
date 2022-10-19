import { useState } from "react";
import { List } from "../../common/List";
import { Spinner } from "../../Spinner/Spinner";
import "./ColorPicker.css"

export function ColorPicker() {

    const [displayText, setDisplayText] = useState("- Drop Layer here -")
    const [titleText, setTitleText] = useState("Filter colors:")
    const [hasInit, setInit] = useState(false);
    const [isAnalyzing, setAnalyzing] = useState(false);

    const [colors, setColors] = useState([]);

    function onDragOver(event) {
        event.preventDefault();
    }

    async function onDrop(event) {
        let res = JSON.parse(event.dataTransfer.getData('text/json'));
        console.log(res);
        setTitleText(`${res.layer.name} colors:`);
        if (!hasInit) {
            await window.highlight.start();
            setInit(true);
        }
        setAnalyzing(true);
        let colors = await window.highlight.sendCommand("setImage", res.layer.src.split(",")[1]);
        setAnalyzing(false);

        console.log(colors.payload);

        setColors(colors.payload);
    }

    return (
        <>
            <span>{titleText}</span>
            <div onDragOver={onDragOver} onDrop={onDrop} className="layerdrop">
                <span>{displayText}</span>
            </div>
            {isAnalyzing && <Spinner text={"Analyzing..."} />}
            {!isAnalyzing && colors && <List items={colors} toContent={item => `${item[0]} (${item[1]})`}></List>}
        </>
    );
}