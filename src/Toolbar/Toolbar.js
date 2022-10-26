import { Children } from 'react';
import './Toolbar.css';

export function Toolbar({ children }) {

    return (
        <div id="toolbar">
            {Children.map(children, (child) => ([child, <hr className="divider" />]))}
        </div>
    );
}