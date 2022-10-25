import { React, useEffect, useRef, useState } from "react";
import { FilePicker } from "../FilePicker/FilePicker";
import './WorkArea.css';

// Thanks to:
// https://dev.to/stackfindover/zoom-image-point-with-mouse-wheel-11n3

// Hacky way to persist data across re-renders
let scale = 1;
let panning = false;
let pointX = 0;
let pointY = 0;
let start = { x: 0, y: 0 };
let ctrlPListener = false;

export function WorkArea(props) {
    const zoom = useRef(null);
    const [isLoading, setLoading] = useState(false);


    useEffect(
        () => {
            document.addEventListener("keydown", onKeyDown);
        },
        []
    );

    async function onKeyDown(event) {
        console.log(props);
        if (document.querySelector("#zoom") && event.ctrlKey && event.key === 'p') {
            let data = document.querySelector("#zoom").innerHTML;
            let blob = new Blob([data], { type: 'text/html' });
            let url = URL.createObjectURL(blob);
            console.log(await window.page.print(url));;
        }
    }

    function setTransform() {
        if (zoom.current) {
            zoom.current.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
        }
    }

    function onMouseEnter(e) {
        panning = e.buttons;
    }

    function onMouseDown(e) {
        e.preventDefault();
        start = { x: e.clientX - pointX, y: e.clientY - pointY };
        panning = true;
    }

    function onMouseUp(e) {
        panning = false;
    }

    function onMouseMove(e) {
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

    /* Turn off loading when new image arrives */
    useEffect(() => {
        console.log(props);
        setLoading(false);
    }, [props]);

    return (
        <div id='workarea'
            /* For zoom operations */
            onWheel={onWheel}
            onMouseMove={onMouseMove}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseUp={onMouseUp}

            /* for file opening */
            onDragEnter={dragenter}
            onDragOver={dragover}
            onDrop={drop}

            /* for printing */
            onKeyDown={onKeyDown}
        >
            {
                (props.layers && props.layers.length > 0 && !isLoading &&
                    <div id="zoom" ref={zoom} >
                        {props.children}
                    </div>
                ) || (
                    <FilePicker loading={isLoading} onFilesReceive={onFilesReceive} />
                )
            }
        </div>
    )
}