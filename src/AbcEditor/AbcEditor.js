import { useEffect, useState } from "react";
import abcjs from "abcjs";
import { ABC_CLASSES } from "../lib/Sheet";

const sheets = [
    `X:1
T: Training Sheet 001
K: E
R: class collection
L: 1/64
Q: 1/4=180
M: 4/4
%%score {V1 V2
V: V1 clef=treble
V: V2 clef=bass
[V:V1]
a1g2=f3e4d6__c8(B16A32)G64|!segno!^c_b|
[V:V2]
z1z2z3z4z6z8z16z32z64|!arpeggio![A,CE]^^d|
[V:V1]
C1- | C1 D2 E3 F4 G6 A8|: c,,1 (d,,2 e,,3 f,,4 g,,6 a,,8):|c128|
[V:V2]
[C,E,G,Bd]- |[CEGBd] D2 e3 f4 g6 a8|: C1 D2 E3 F4 G6 A8:|[C,c,]128|`
];

export function AbcEditor({ abcLayers }) {
    const [value, setValue] = useState(sheets[0]);
    const [checked, setChecked] = useState(false);

    const abcOptions = {
        responsive: "resize",
        viewportVertical: true,
        add_classes: true,
        selectTypes: [],
    };

    function handleChange(event) {
        setValue(event.target.value);
        let log = abcjs.renderAbc('abc-content', event.target.value, abcOptions);
        console.log(log[0]);
    }


    function colorize(flag) {
        console.log(flag);
        setChecked(flag);

        if (flag) {
            Object.keys(ABC_CLASSES).forEach(key => {
                const [selector, segColorA, segColorB] = ABC_CLASSES[key];
                document.querySelectorAll(selector).forEach(elem => {
                    elem.style.stroke = segColorB;
                    elem.style.fill = segColorB;
                })
            });
        } else {
            Object.keys(ABC_CLASSES).forEach(key => {
                const [selector, segColorA, segColorB] = ABC_CLASSES[key];
                document.querySelectorAll(selector).forEach(elem => {
                    elem.style.stroke = '';
                    elem.style.fill = '';
                })
            });
        }
    }

    useEffect(() => {
        abcjs.renderAbc('abc-content', value, abcOptions);
    }, [])

    return (
        <div id="abc-editor">
            <textarea value={value} onChange={handleChange} id="" cols="30" rows="10"></textarea>
            <label>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={event => colorize(event.target.checked)}
                />
                <span>Colorize</span>
            </label>
        </div>
    );
}