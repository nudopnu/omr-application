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

export function WorkArea({ layers, children, onOpenFiles, addLayer }) {
    const zoom = useRef(null);
    const [isLoading, setLoading] = useState(false);


    useEffect(
        () => {
            document.addEventListener("keydown", onKeyDown);
        },
        []
    );

    async function onKeyDown(event) {
        if (document.querySelector("#zoom") && event.ctrlKey) {
            if (event.key === 'k') {
                const elem = document.querySelector("#workarea-content");
                let { width, height } = elem.children[0].getClientRects()[0]
                width = Math.ceil(width);
                height = Math.ceil(height);

                elem.style.width = `${width}px`;
                elem.style.height = `${height}px`;

                let data = elem.outerHTML;
                let blob = new Blob([data], { type: 'text/html' });
                let url = URL.createObjectURL(blob);

                elem.style.width = '';
                elem.style.height = '';

                const res = await window.page.capture(url, width, height);
                const newLayer = {
                    type: 'base64ImageUrl',
                    name: 'Rasterized',
                    visible: true,
                    src: res
                };
                addLayer(newLayer);
            }
            else if (event.key === 'p') {

                /* Work on a clone */
                const refElem = document.querySelector("#workarea-content");
                const cloneElem = refElem.cloneNode(true);

                /* Make each layer to a new page */
                [...cloneElem.children].forEach(child => {
                    child.style.width = `100%`;
                    child.style.setProperty('page-break-after', 'always');
                })

                /* Convert innerHTML to objecturl */
                let data = cloneElem.innerHTML;
                let blob = new Blob([data], { type: 'text/html' });
                let url = URL.createObjectURL(blob);

                /* Send to main process */
                await window.page.print(url, true);
            }
            else if (event.key === 'd') {
                const elem = document.querySelector("[role='img']");
                let data = elem.outerHTML;
                let blob = new Blob([data], { type: 'image/svg+xml' });
                let url = URL.createObjectURL(blob);
                let a = document.createElement("a");
                a.href = url;
                a.download = "sheet.svg";
                a.click();
            }
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
        onOpenFiles(files);
    }

    function onFilesReceive(files) {
        /* Delegate responsibility */
        if (!isLoading) {
            setLoading(true);
            onOpenFiles(files)
        }
    }

    /* Turn off loading when new image arrives */
    useEffect(() => {
        setLoading(false);
    }, [layers]);

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
                (layers && layers.length > 0 && !isLoading &&
                    <div id="zoom" ref={zoom} >
                        <div id="workarea-content">
                            {children}
                        </div>
                    </div>
                ) || (
                    <FilePicker loading={isLoading} onFilesReceive={onFilesReceive} />
                )
            }
        </div>
    )
}