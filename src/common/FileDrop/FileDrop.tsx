import React from 'react';
import './FileDrop.css';

export function FileDrop({ instruction = "Drop file here", onFilesReceive = console.log }) {

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
        onFilesReceive(files);
    }

    return (
        <div
            id='area'
            onDragEnter={dragenter}
            onDragOver={dragover}
            onDrop={drop}
        >
            - {instruction} -
        </div>
    )
}