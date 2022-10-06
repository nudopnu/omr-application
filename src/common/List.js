import { useState } from "react";
import "./List.css";

export function List({ items, onSelect, toKey = (item) => item, toContent = (item) => (item) }) {

    const [selected, setSelected] = useState(null);

    function selectionHandler(item) {
        setSelected(toKey(item));
        onSelect(item);
    }

    let fired = false;
    let focused = false;

    function onFocus(_event) {
        console.log("FOCUS");
        focused = true;
    }
    function onBlur(_event) {
        focused = false;
        console.log("UNFOCUS");
    }

    function onKeyDown(event) {
        event.stopPropagation();
        if (fired || !focused || !selected) return
        let curIdx = items.indexOf(item => toKey(item) === selected.current)
        console.log(items, selected.current, event);
        switch (event.key) {
            case 'ArrowUp':
                if (curIdx > 0) {
                    setSelected(toKey(items[curIdx - 1]));
                    onSelect(items[curIdx - 1]);
                }
                break;
            case 'ArrowDown':
                if (curIdx < items.length - 1) {
                    setSelected(toKey(items[curIdx + 1]));
                    onSelect(items[curIdx + 1]);
                }
                break;
            default:
                break;
        }
        fired = true;
    }
    function onKeyUp(event) {
        fired = false;
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return (
        <div id="list" onBlur={onBlur} onFocus={onFocus}>
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