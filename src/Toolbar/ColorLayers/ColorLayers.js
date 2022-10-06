import { useEffect, useRef, useState } from 'react';
import { List } from '../../common/List';
import { getDistinctColors, highlightColor, readAsDataURL } from '../../lib/Image';
import './ColorLayers.css'

export function ColorLayers({ canvas, updateImage }) {

    const [layers, setLayers] = useState([]);
    const [hasSentImage, setHasSentImage] = useState(false);
    let toContent = useRef(item => `#${item.r.toString(16).padStart(2, "0")}${item.g.toString(16).padStart(2, "0")}${item.b.toString(16).padStart(2, "0")}`);

    useEffect(() => {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let res = getDistinctColors(imageData.data);
        let everyGray = true;
        res.forEach(layer => {
            if (!(layer.r === layer.g && layer.g === layer.b)) {
                everyGray = false;
            }
        });
        if (everyGray) {
            toContent.current = (item) => `#${item.r.toString(16).padStart(2, "0")}${item.g.toString(16).padStart(2, "0")}${item.b.toString(16).padStart(2, "0")} (${item.r})`;
            res = res.sort((a, b) => a.r - b.r)
        } else {
            res = res.sort((a, b) => toContent.current(a).localeCompare(toContent.current(b)))
        }
        setLayers(res);
    }, [canvas]);

    async function onLayerSelect(sel) {
        const hex = `#${sel.r.toString(16).padStart(2, "0")}${sel.g.toString(16).padStart(2, "0")}${sel.b.toString(16).padStart(2, "0")}`;
        if (!hasSentImage) {
            console.log(`selecting ${hex}, sending`, canvas.toDataURL());
            let res = await window.layers.provideImage(canvas.toDataURL());
            console.log(res);
            setHasSentImage(true);
        }
        let res = await window.layers.highlight(hex);
        res = "data:image/png;base64," + res.slice(2, -1);
        updateImage(res);
    }

    return (
        <div>
            Layers:
            <List
                items={layers}
                toKey={item => [item.r, item.g, item.b].join("")}
                toContent={toContent.current}
                onSelect={onLayerSelect}
            />
        </div>
    );
}