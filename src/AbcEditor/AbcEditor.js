import { useEffect, useState } from "react";
import abcjs from "abcjs";
import { ABC_CLASSES, DEFAULF_GENERATOR_SETTINGS, generateRandomSheet } from "../lib/Sheet";

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
        viewportHorizontal: true,
    };

    function handleChange(event) {
        setValue(event.target.value);
        let log = abcjs.renderAbc('abc-content', event.target.value, abcOptions);
        setChecked(false);
        console.log(log[0]);
    }

    function onClickRandom() {
        let abc = generateRandomSheet(DEFAULF_GENERATOR_SETTINGS.settings);
        console.log(abc);
        setValue(abc);
        setChecked(false);
        abcjs.renderAbc('abc-content', abc, abcOptions);
    }


    function colorize(flag) {
        console.log(flag);
        setChecked(flag);

        if (flag) {
            Object.keys(ABC_CLASSES).forEach(key => {
                const [fetchOps, segColorA, segColorB] = ABC_CLASSES[key];
                const { selector } = fetchOps
                document.querySelectorAll(selector).forEach(elem => {
                    if (fetchOps.aspectRatio) {
                        const t = 0.001
                        const { width, height } = elem.getBoundingClientRect();
                        const aspectRatio = width / height;
                        let condition = fetchOps.condition ? fetchOps.condition : (a, b) => Math.abs(a - b) > t;
                        if (condition(aspectRatio, fetchOps.aspectRatio))
                            return
                    }
                    elem.style.color = segColorB;
                })
                if (document.querySelectorAll(selector).length === 0) {
                    console.log("[NOT FOUND]:", key);
                }
            });
        } else {
            Object.keys(ABC_CLASSES).forEach(key => {
                const [fetchOps, segColorA, segColorB] = ABC_CLASSES[key];
                const { selector } = fetchOps
                document.querySelectorAll(selector).forEach(elem => {
                    if (fetchOps.aspectRatio) {
                        const t = 0.001
                        const { width, height } = elem.getBoundingClientRect();
                        const aspectRatio = width / height;
                        let condition = fetchOps.condition ? fetchOps.condition : (a, b) => Math.abs(a - b) > t;
                        if (condition(aspectRatio, fetchOps.aspectRatio))
                            return
                    }
                    elem.style.color = '';
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
            <button onClick={onClickRandom}>Random</button>
        </div>
    );
}