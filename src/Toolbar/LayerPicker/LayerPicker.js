import "./LayerPicker.css";

export function LayerPicker({ layers }) {

    function renderLayer(layer) {
        return (
            <div className="layerselect">
                <div className="eyebox">
                    <div className="eye"></div>
                </div>
                {layer.name}
            </div>
        )
    }

    return (
        <>
            <span>Layers:</span>
            {layers.map(layer => renderLayer(layer))}
        </>
    );
}