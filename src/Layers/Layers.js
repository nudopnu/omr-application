import "./Layers.css"
export function Layers({ layers }) {

    function renderLayer(idx, layer) {
        if (layer.type === "base64ImageUrl" && layer.visible) {
            return <img key={idx} src={layer.src} alt="" className="layer" />
        }
    }

    return (
        <>
            {layers.map((layer, idx) => renderLayer(idx, layer))}
        </>
    )
}