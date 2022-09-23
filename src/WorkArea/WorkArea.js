import { useRef } from "react";
import { React } from "react";
import './WorkArea.css'

// Thanks to:
// https://dev.to/stackfindover/zoom-image-point-with-mouse-wheel-11n3

export function WorkArea({ image }) {
    const aImg = useRef(null);
    const zoom = useRef(null);

    let scale = 1,
        panning = false,
        pointX = 0,
        pointY = 0,
        start = { x: 0, y: 0 };

    function setTransform() {
        zoom.current.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
    }

    function onmousedown(e) {
        e.preventDefault();
        start = { x: e.clientX - pointX, y: e.clientY - pointY };
        panning = true;
    }

    function onmouseup(e) {
        panning = false;
    }

    function onmousemove(e) {
        e.preventDefault();
        if (!panning) {
            return;
        }
        pointX = (e.clientX - start.x);
        pointY = (e.clientY - start.y);
        setTransform();
    }

    function onWheel(e) {
        e.preventDefault();
        let xs = (e.clientX - pointX) / scale;
        let ys = (e.clientY - pointY) / scale;
        let delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
        (delta > 0) ? (scale *= 1.2) : (scale /= 1.2);
        pointX = e.clientX - xs * scale;
        pointY = e.clientY - ys * scale;
        setTransform();
    }

    return (
        <div id='workarea'
            onWheel={onWheel}
            onMouseMove={onmousemove}
            onMouseDown={onmousedown}
            onMouseUp={onmouseup}>
            <div id="block">
                <div id="zoom" ref={zoom} >
                    <img ref={aImg} src={image} alt="" draggable="false" />
                </div>
            </div>
        </div>
    )
}