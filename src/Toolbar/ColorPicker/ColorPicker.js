import { useState } from "react";
import { List } from "../../common/List";
import { Spinner } from "../../Spinner/Spinner";
import "./ColorPicker.css"

export function ColorPicker({ addLayer }) {

    const [titleText, setTitleText] = useState("Filter colors:")
    const [hasInit, setInit] = useState(false);
    const [isAnalyzing, setAnalyzing] = useState(false);

    const [colors, setColors] = useState([]);
    const [highlighLayerIndex, setHighlightLayerIndex] = useState(null);

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
        setColors(colors.payload);
    }

    async function onSelectColor(color) {
        console.log(color);
        let response = await window.highlight.sendCommand("highlight", color[0]);
        let dataUrl = "data:image/png;base64," + response.payload.slice(2, -1)
        const newLayer = {
            type: 'base64ImageUrl',
            name: 'Highlight',
            visible: true,
            src: dataUrl
        };
        addLayer(newLayer)
    }

    function renderColorItem(item) {
        return (
            <div style={sytle}>
                <span>{item[0]}</span><span>({item[1]})</span>
            </div>
        );
    }

    const sytle = {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
    };

    return (
        <>
            <span>{titleText}</span>
            <div onDragOver={onDragOver} onDrop={onDrop} className="layerdrop">
                <span>- Drop Layer here -</span>
            </div>
            {isAnalyzing && <Spinner text={"Analyzing..."} />}
            {!isAnalyzing && colors.length > 0 && <List items={colors} toContent={renderColorItem} onSelect={onSelectColor}></List>}
        </>
    );
}