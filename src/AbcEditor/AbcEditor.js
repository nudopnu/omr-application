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
    const [hints, setHints] = useState([]);
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
        validate();
    }

    async function onClickConvert2() {
        /* Work on a clone */
        const refElem = document.querySelector("#workarea-content");
        const cloneElem = refElem.cloneNode(true);

        /* Make each layer to a new page */
        [...cloneElem.children].forEach(child => {
            child.style.width = `100%`;
            child.style.height = `100%`;
            child.style.setProperty('page-break-after', 'always');
        })

        /* Generate DeepScores-style labels */
        const abcRef = document.querySelector('#abc-render');
        let abcClone = abcRef.cloneNode(true);
        abcClone.style.setProperty('height', '100%');
        const keys = Object.keys(ABC_CLASSES);
        colorize(keys, true, abcClone);
        cloneElem.appendChild(abcClone);

        /* Generate masks */
        keys.forEach(key => {
            let abcClone = abcRef.cloneNode(true);
            abcClone.style.setProperty('color', '#fff0');
            abcClone.style.setProperty('height', '100%');
            colorize([key], true, abcClone, _key => 'black');
            cloneElem.appendChild(abcClone);
        });

        /* Convert innerHTML to objecturl */
        let data = cloneElem.innerHTML;
        let blob = new Blob([data], { type: 'text/html' });
        let url = URL.createObjectURL(blob);

        /* Send to main process */
        const pdf = await window.page.print(url, false);

        /* Convert pdf to png using ImageMagick */
        const dpi = 280;
        await window.page.pdf2png(pdf, dpi);
        console.log("Done");
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

    function validate(abcElem = document) {
        const keys = Object.keys(ABC_CLASSES);
        let hintText = [];

        keys.forEach(key => {
            ABC_CLASSES[key].access.forEach(acc => {
                const { selector, aspectRatio, condition } = acc;
                let isPresent = false;
                abcElem.querySelectorAll(selector).forEach(elem => {
                    if (aspectRatio) {
                        const t = 0.001
                        const { width, height } = elem.getBoundingClientRect();
                        const aspectRatio = width / height;
                        let cond = condition ? condition : (a, b) => Math.abs(a - b) > t;
                        if (cond(aspectRatio, aspectRatio))
                            return
                    }
                    isPresent = true;
                });
                if (!isPresent)
                    hintText.push(`[NOT FOUND]: ${key}`);
            });
        });

        setHints(hintText)

    }

    function colorize(keys, flag, abcElem = document, getColor = (key => ABC_CLASSES[key].colors[1])) {

        keys.forEach(key => {
            ABC_CLASSES[key].access.forEach(acc => {
                const { selector, aspectRatio, condition } = acc;
                abcElem.querySelectorAll(selector).forEach(elem => {
                    if (aspectRatio) {
                        const t = 0.001
                        const { width, height } = elem.getBoundingClientRect();
                        const aspectRatio = width / height;
                        let cond = condition ? condition : (a, b) => Math.abs(a - b) > t;
                        if (cond(aspectRatio, aspectRatio))
                            return
                    }
                    elem.style.color = flag ? getColor(key) : '';
                })
            });
        });

    }

    useEffect(() => {
        const keys = Object.keys(ABC_CLASSES);
        colorize(keys, checked);
    }, [checked])

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
                    onChange={_event => setChecked(!checked)}
                />
                <span>Preview ground truth</span>
            </label>
            <button onClick={onClickRandom}>Random Piano Sheet</button>
            <button onClick={onClickConvert}>Convert to PNG</button>
            <button onClick={onClickConvert2}>Generate XY</button>
            <div id="hints">{hints.map(hint => <div key={hint}>{hint}</div>)}</div>
        </div>
    );
}