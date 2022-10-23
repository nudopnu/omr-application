import { useEffect, useState } from "react";
import abcjs from "abcjs";

export function AbcEditor({ abcLayers }) {
    const [value, setValue] = useState("X:1\nK:C\nI:papersize A4\nCDEFGABc");

    const abcOptions = {
        responsive: "resize",
        viewportVertical: true,
    };

    function handleChange(event) {
        setValue(event.target.value);
        let log = abcjs.renderAbc('abc-content', event.target.value, abcOptions);
        console.log(log[0]);
    }

    useEffect(() => {
        abcjs.renderAbc('abc-content', value, abcOptions);
    }, [])


    return (
        <>
            <textarea value={value} onChange={handleChange} id="" cols="30" rows="10"></textarea>
        </>
    );
}