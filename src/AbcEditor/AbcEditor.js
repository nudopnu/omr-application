import { useEffect, useState } from "react";
import abcjs from "abcjs";
import { ABC_CLASSES, DEFAULF_GENERATOR_SETTINGS, generateRandomSheet } from "../lib/Sheet";
import "./AbcEditor.css";
import { Buffer } from 'buffer';

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

export function AbcEditor({ abcLayers, addLayer }) {
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

    async function onClickConvert2() {
        const elem = document.querySelector("#workarea-content");
        let data = elem.outerHTML;
        let blob = new Blob([data], { type: 'text/html' });
        let url = URL.createObjectURL(blob);
        const pdf = await window.page.print(url, false);
        const dpi = 280;
        const res = await window.page.pdf2png(pdf, dpi);
        // console.log(res.slice(0, 100));
        const dataUrl = "data:image/png;base64," + res;
        const newLayer = {
            type: 'base64ImageUrl',
            name: 'Rasterized',
            visible: true,
            src: dataUrl
        };
        addLayer(newLayer);
        console.log(dataUrl);
    }
    function onClickConvert() {

        const svgElement = document.querySelector('.abcjs-container > svg');
        svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");

        // svgElement.setAttribute("shape-rendering", "crispEdges");
        // svgElement.style.filter = 'url(#crispify)';
        // const defs = document.createElement("defs");
        // defs.innerHTML = `<filter id="crispify">
        // <feComponentTransfer>
        // <feFuncA type="discrete" tableValues="0 1"/>
        // </feComponentTransfer>
        // </filter>`;
        // svgElement.appendChild(defs);

        /* Create canvas to draw image on */
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext("2d");

        /* Turn svg to dataurl for image */
        const svg = svgElement.outerHTML;
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const image = document.createElement('img');

        image.addEventListener('load', () => URL.revokeObjectURL(url), { once: true });
        image.addEventListener('load', () => {
            canvas.width = 2480;
            canvas.height = 3508;

            /* Add white background */
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(image, 0, 0);

            const dataUrl = canvas.toDataURL('image/png');
            console.log(dataUrl);
            addLayer({
                type: 'base64ImageUrl',
                name: 'Rasterized',
                visible: true,
                src: dataUrl
            });
        });
        image.addEventListener('error', () => console.log("Error rasterizing image"));
        image.src = url;
        console.log(svg, image);
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
                <span>Preview ground truth</span>
            </label>
            <button onClick={onClickRandom}>Random Piano Sheet</button>
            <button onClick={onClickConvert}>Convert to PNG</button>
            <button onClick={onClickConvert2}>Generate XY</button>
        </div>
    );
}