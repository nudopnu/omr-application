import "./LayerPicker.css";

export function LayerPicker({ layers, replaceLayer, deleteLayer }) {

    function onDragStart(event, index, layer) {
        event.dataTransfer.setData("text/json", JSON.stringify({
            index: index,
            layer: layer,
        }));
        event.dataTransfer.effectAllowed = "link";
    }

    function toggleVisibility(index, layer) {
        replaceLayer(index, oldLayer => ({
            ...oldLayer,
            visible: !layer.visible,
        }));
    }

    function onDeleteLayer(event, index) {
        event.stopPropagation();
        console.log("del");
        deleteLayer(index);
    }

    function renderLayer(index, layer) {
        let classname = "layerselect";
        console.log(layer.type);
        if (layer.type === "abc-render") { classname += " dynamic"; }
        return (
            <div
                className={classname}
                draggable={true}
                onDragStart={event => onDragStart(event, index, layer)}
                onClick={_event => toggleVisibility(index, layer)}
                key={index}
            >
                <div className="eyebox">
                    {layer.visible && <div className="eye"></div>}
                </div>
                <div className="layerselecttext">
                    {index} - {layer.name}
                </div>
                <div className="lasyerselectdelete" onClick={event => onDeleteLayer(event, index)}>
                    X
                </div>
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