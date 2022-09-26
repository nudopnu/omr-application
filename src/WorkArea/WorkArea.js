import { React, useEffect, useRef, useState } from "react";
import { FilePicker } from "../FilePicker/FilePicker";
import './WorkArea.css';

// Thanks to:
// https://dev.to/stackfindover/zoom-image-point-with-mouse-wheel-11n3

export function WorkArea(props) {
    const aImg = useRef(null);
    const zoom = useRef(null);
    const [isLoading, setLoading] = useState(false);

    let scale = 1,
        panning = false,
        pointX = 0,
        pointY = 0,
        start = { x: 0, y: 0 };

    function setTransform() {
        if (zoom.current) {
            zoom.current.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
        }
    }

    function onmouseenter(e) {
        panning = e.buttons;
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
        let xs = (e.clientX - pointX) / scale;
        let ys = (e.clientY - pointY) / scale;
        let delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
        (delta > 0) ? (scale *= 1.2) : (scale /= 1.2);
        pointX = e.clientX - xs * scale;
        pointY = e.clientY - ys * scale;
        setTransform();
    }

    function dragenter(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    function dragover(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    function drop(e) {
        e.stopPropagation();
        e.preventDefault();

        /* Delegate responsibility */
        const files = e.dataTransfer.files;
        setLoading(true);
        props.onOpenFiles(files);
    }

    function onFilesReceive(files) {
        /* Delegate responsibility */
        if (!isLoading) {
            setLoading(true);
            props.onOpenFiles(files)
        }
    }

    useEffect(() => {
        setLoading(false);
      }, [props.image]);

    return (
        <div id='workarea'
            /* For zoom operations */
            onWheel={onWheel}
            onMouseMove={onmousemove}
            onMouseDown={onmousedown}
            onMouseEnter={onmouseenter}
            onMouseUp={onmouseup}

            /* for file opening */
            onDragEnter={dragenter}
            onDragOver={dragover}
            onDrop={drop}
        >
            <div id="block">
                {
                    (props.image && !isLoading &&
                        <div id="zoom" ref={zoom} >
                            <img ref={aImg} src={props.image} alt="" draggable="false" />
                        </div>
                    ) || (
                        <FilePicker loading={isLoading} onFilesReceive={onFilesReceive} />
                    )
                }
            </div>
        </div>
    )
}