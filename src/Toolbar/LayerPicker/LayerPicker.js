import "./LayerPicker.css";

export function LayerPicker({ layers, setVisibility }) {

    function onDragStart(event, index, layer) {
        event.dataTransfer.setData("text/json", JSON.stringify({
            index: index,
            layer: layer,
        }));
        event.dataTransfer.effectAllowed = "link";
    }

    function onClick(index, layer) {
        console.log(index, layer);
        setVisibility(index, !layer.visible);
    }

    function renderLayer(index, layer) {
        return (
            <div
                className="layerselect"
                draggable={true}
                onDragStart={event => onDragStart(event, index, layer)}
                onClick={_event => onClick(index, layer)}
                key={index}
            >
                <div className="eyebox">
                    {layer.visible && <div className="eye"></div>}
                </div>
                {index} - {layer.name}
            </div>
        )
    }

    return (
        <>
            <span>Layers:</span>
            <div className="layers">
                {layers.map((layer, index) => renderLayer(index, layer))}
            </div>
        </>
    );
}