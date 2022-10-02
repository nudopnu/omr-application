import { useEffect, useState } from 'react';
import { List } from '../../common/List';
import { getDistinctColors, highlightColor } from '../../lib/Image';
import './ColorLayers.css'

export function ColorLayers({ canvas }) {

    const [layers, setLayers] = useState([])

    useEffect(() => {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setLayers(getDistinctColors(imageData.data));
    }, []);
    
    function onLayerSelect(sel) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const hex = `#${sel.r.toString(16)}${sel.g.toString(16)}${sel.b.toString(16)}`;
        const res = highlightColor(imageData.data, hex)
        console.log(res);
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