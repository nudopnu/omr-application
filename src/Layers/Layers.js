import "./Layers.css"
export function Layers({ layers }) {

    function renderLayer(layer) {
        if (layer.type === "base64ImageUrl") {
            return <img src={layer.src} alt="" srcset="" className="layer" />
        }
    }

    return (
        <>
            {layers.map(layer => renderLayer(layer))}
        </>
    )
}