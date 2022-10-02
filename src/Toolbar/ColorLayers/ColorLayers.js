import { useEffect, useState } from 'react';
import { List } from '../../common/List';
import { getDistinctColors, highlightColor, readAsDataURL } from '../../lib/Image';
import './ColorLayers.css'

export function ColorLayers({ canvas, updateImage }) {

    const [layers, setLayers] = useState([]);
    const [hasSentImage, setHasSentImage] = useState(false);

    useEffect(() => {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setLayers(getDistinctColors(imageData.data));
    }, []);

    async function onLayerSelect(sel) {
        const hex = `#${sel.r.toString(16)}${sel.g.toString(16)}${sel.b.toString(16)}`;
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
                toContent={item => `#${item.r.toString(16)}${item.g.toString(16)}${item.b.toString(16)}`}
                onSelect={onLayerSelect}
            />
        </div>
    );
}