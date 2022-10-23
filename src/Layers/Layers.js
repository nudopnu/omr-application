import "./Layers.css"
export function Layers({ layers }) {

    function renderLayer(idx, layer) {
        let style = layer.visible ? {} : { display: 'none' }
        console.log(style);
        if (layer.type === "base64ImageUrl") {
            return <img key={idx} src={layer.src} alt="" className="layer" style={style} />
        } else if (layer.type === "abc-render") {
            return <div key={idx} id="abc-render" style={style}>
                <div id="abc-content"></div>
            </div>
        }
    }

    return (
        <>
            {layers.map((layer, idx) => renderLayer(idx, layer))}
        </>
    )
}