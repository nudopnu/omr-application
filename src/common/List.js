import { useState } from "react";
import "./List.css";

export function List({ items, onSelect, toKey = (item) => item, toContent = (item) => (item) }) {

    const [selected, setSelected] = useState(null);

    function selectionHandler(item) {
        onSelect(item);
        setSelected(toKey(item));
    }

    return (
        <div id="list">
            {items && items.map(item =>
                <span
                    key={toKey(item)}
                    className={`entry${toKey(item) === selected ? " selected" : ""}`}
                    onClick={_ => selectionHandler(item)}
                >
                    {toContent(item)}
                </span>
            )}
        </div>
    );
}