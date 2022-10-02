import { Children, useState } from 'react';
import { ModelPicker } from './ModelPicker/ModelPicker';
import './Toolbar.css'

export function Toolbar({ canvas, children }) {

    return (
        <div id="toolbar">
            {Children.map(children, (child) => ([child, <hr className="divider" />]))}
        </div>
    );
}