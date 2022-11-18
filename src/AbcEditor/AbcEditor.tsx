import React from 'react';
import abcjs, { AbcVisualParams } from "abcjs";
import { useEffect, useState } from "react";
import { ABC_CLASSES, DEFAULF_GENERATOR_SETTINGS, generateRandomSheet } from "../lib/Sheet";
import "./AbcEditor.css";
import { AbcConverter } from '../lib/Music/AbcUtils/AbcConverter';
import { SheetGenerator } from '../lib/Music/SheetGenerator/SheetGenerator';
import { createRoot } from 'react-dom/client';
import { SvgFilter } from './SvgFilter';

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
    const [value, setValue] = useState<string>(sheets[0]);
    const [hints, setHints] = useState<string[]>([]);
    const [checked, setChecked] = useState<boolean>(false);

    const abcOptions: AbcVisualParams = {
        responsive: "resize",
        viewportVertical: true,
        add_classes: true,
        selectTypes: [],
        viewportHorizontal: true,
    };

    window.addEventListener('resize', event => {
        (document.querySelector('#abc-content')! as HTMLElement).style.setProperty('width', '100%');
    });

    function handleChange(event) {
        setValue(event.target.value);
        abcjs.renderAbc('abc-content', event.target.value, abcOptions);
        postProcess();
        setChecked(false);
        setHints([]);
    }

    function postProcess() {
        ([...document.querySelectorAll('[font-family="Times"]')] as HTMLElement[]).forEach(elem => {
            console.log(elem);
            elem.style.setProperty('font-family', "Maestro");
            elem.style.setProperty('font-size', '22px');
        });
        ([...document.querySelectorAll('[font-family="Helvetica"]')] as HTMLElement[]).forEach(elem => {
            console.log(elem);
            elem.style.setProperty('font-family', "Maestro");
            elem.style.setProperty('font-weight', 'bold');
            elem.style.setProperty('font-size', 'small');
        });

        /* Inject filter defs */
        const abcContentContainer = document.querySelector('.abcjs-inner > svg') as HTMLElement;
        const defContainer = document.createElement('defs');
        abcContentContainer.appendChild(defContainer)
        const root = createRoot(defContainer);
        root.render(<SvgFilter />);

        /* Apply filters */
        const rotation = 2;
        ([...document.querySelectorAll('svg > g')] as HTMLElement[]).forEach(element => {
            element.style.setProperty('filter', 'url(#displacementFilter)');
            element.style.setProperty('transform-box', 'fill-box');
            /* Add per-staff rotation */
            element.style.setProperty('transform', `rotate(${rotation}deg)`);
        });

        /* Apply 3d rotation */
        // (document.querySelector('svg') as SVGElement)
        //     .style
        //     .setProperty('transform', 'perspective(25cm) scale(.8) rotateX(4deg) rotateY(4deg)');

        /* Apply staff thickness */
        ([...document.querySelectorAll('.abcjs-staff > path')] as HTMLElement[]).forEach(elem => {
            const scaleX = 1;
            const scaleY = 2;
            elem.style.setProperty("transform", `scale(${scaleX}, ${scaleY})`);
            elem.style.setProperty('transform-box', 'fill-box');
        });

        /* Add background paper */
        const paper = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        paper.setAttribute('width', '100%');
        paper.setAttribute('height', '100%');
        paper.style.setProperty('filter', 'url(#paper)');
        abcContentContainer.insertBefore(paper, abcContentContainer.firstChild);

        /* Add background noise */
        const noise = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        noise.setAttribute('width', '100%');
        noise.setAttribute('height', '100%');
        noise.style.setProperty('filter', 'url(#noise)');
        // abcContentContainer.appendChild(noise);

    }

    function onClickGenerateRandom() {
        let abc = generateRandomSheet(DEFAULF_GENERATOR_SETTINGS.settings);
        console.log(abc);
        setValue(abc);
        setChecked(false);
        abcjs.renderAbc('abc-content', abc, abcOptions);
        postProcess();
        validate();
    }

    function onClickGenerateScale() {
        const sheet = SheetGenerator.generateScaleSheet();
        let abc = AbcConverter.fromSheet(sheet);
        console.log(abc);
        setValue(abc);
        setChecked(false);
        abcjs.renderAbc('abc-content', abc, abcOptions);
        postProcess();
        validate();
    }

    function onClickGenerateOrnaments() {
        const sheet = SheetGenerator.generateOrnamentsSheet();
        let abc = AbcConverter.fromSheet(sheet);
        console.log(abc);
        setValue(abc);
        setChecked(false);
        abcjs.renderAbc('abc-content', abc, abcOptions);
        postProcess();
        validate();
    }

    async function onClickConvert2() {
        let hintText: string[] = [];

        /* Work on a clone */
        const refElem = document.querySelector("#workarea-content") as HTMLElement;
        if (!refElem) throw new Error("Editor not initialized!");
        const cloneElem = refElem.cloneNode(true) as HTMLElement;

        /* Make each layer to a new page */
        ([...cloneElem.children] as HTMLElement[]).forEach(child => {
            child.style.width = `100%`;
            child.style.height = `100%`;
            child.style.setProperty('page-break-after', 'always');
        })

        /* Generate DeepScores-style labels */
        const abcRef = document.querySelector('#abc-render');
        if (!abcRef) throw new Error("Editor not initialized!");
        let abcClone = abcRef.cloneNode(true) as HTMLElement;
        abcClone.style.setProperty('height', '100%');
        const keys = Object.keys(ABC_CLASSES).sort(elem => ABC_CLASSES[elem].order);
        colorize(keys, true, abcClone);
        cloneElem.appendChild(abcClone);

        /* Generate gray-valued labels */
        abcClone = abcRef.cloneNode(true) as HTMLElement;
        abcClone.style.setProperty('background-color', '#000');
        abcClone.style.setProperty('height', '100%');
        const hexGrey = key => ABC_CLASSES[key].order.toString(16).padStart(2, '0')
        colorize(keys, true, abcClone, key => `#${hexGrey(key)}${hexGrey(key)}${hexGrey(key)}`);
        cloneElem.appendChild(abcClone);

        /* Generate masks */
        keys.forEach(key => {
            let abcClone = abcRef.cloneNode(true) as HTMLElement;
            abcClone.style.setProperty('background-color', '#000');
            abcClone.style.setProperty('color', '#fff0');
            abcClone.style.setProperty('height', '100%');
            colorize([key], true, abcClone, _key => 'white');
            cloneElem.appendChild(abcClone);
        });

        /* Convert innerHTML to objecturl */
        let data = cloneElem.innerHTML;
        let blob = new Blob([data], { type: 'text/html' });
        let url = URL.createObjectURL(blob);

        /* Send to main process */
        hintText = ["Generating pdf..."];
        setHints(hintText)
        const pdf = await (window as any).page.print(url, false);
        hintText = [...hintText, "Done."]
        setHints(hintText)

        /* Convert pdf to png using ImageMagick */
        hintText = [...hintText, "Converting to PNG..."]
        setHints(hintText)
        const dpi = 280;
        await (window as any).page.pdf2png(pdf, dpi);
        hintText = [...hintText, "Done."]
        setHints(hintText)
    }
    function onClickConvert() {

        const svgElement = document.querySelector('.abcjs-container > svg') as HTMLElement;
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
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

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
        const keys = Object.keys(ABC_CLASSES).sort(elem => ABC_CLASSES[elem].order);
        let hintText: string[] = [];
        let presentKeys: string[] = [];
        setHints(["Cheking..."])

        keys.forEach(key => {
            ABC_CLASSES[key].access.forEach(acc => {
                const { selector, aspectRatio, condition } = acc;
                let isPresent = false;
                abcElem.querySelectorAll(selector).forEach(elem => {
                    if (aspectRatio) {
                        const t = 0.001
                        const { width, height } = elem.getBoundingClientRect();
                        const ar = width / height;
                        let cond = condition ? condition : (a, b) => Math.abs(a - b) > t;
                        if (cond(ar, aspectRatio))
                            return
                    }
                    isPresent = true;
                });
                if (!isPresent)
                    hintText.push(`[NOT FOUND]: ${key}`);
                else
                    presentKeys.push(key);
            });
        });

        if (hintText.length === 0) {
            hintText = ["All classes present"]
        }
        console.log(hintText);
        setHints(["Cheking...", ...hintText])
        return presentKeys;
    }

    function colorize(keys, flag, abcElem: HTMLElement = (document as any), getColor = (key => ABC_CLASSES[key].colors[1])) {
        keys.forEach(key => {
            ABC_CLASSES[key].access.forEach(acc => {
                const { selector, aspectRatio, condition } = acc;
                abcElem.querySelectorAll(selector).forEach(elem => {
                    if (aspectRatio) {
                        const t = 0.001
                        const { width, height } = elem.getBoundingClientRect();
                        const ar = width / height;
                        let cond = condition ? condition : (a, b) => Math.abs(a - b) > t;
                        if (cond(ar, aspectRatio))
                            return
                    }
                    elem.style.color = flag ? getColor(key) : '';
                })
            });
        });

    }

    useEffect(() => {
        const keys = Object.keys(ABC_CLASSES).sort(elem => ABC_CLASSES[elem].order);
        colorize(keys, checked);
    }, [checked])

    useEffect(() => {
        abcjs.renderAbc('abc-content', value, abcOptions);
        postProcess();
    }, [])

    return (
        <div id="abc-editor">
            <textarea value={value} onChange={handleChange} id="" cols={30} rows={10}></textarea>
            <label>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={_event => setChecked(!checked)}
                />
                <span>Preview ground truth</span>
            </label>
            <button onClick={onClickGenerateRandom}>Random Piano Sheet</button>
            <button onClick={onClickGenerateScale}>Scale Sheet</button>
            <button onClick={onClickGenerateOrnaments}>Ornaments Sheet</button>
            <button onClick={onClickConvert}>Convert to PNG</button>
            <button onClick={onClickConvert2}>Generate XY</button>
            <div>
                <div>Turbulence</div>
                <input type="range" min={0} max={100} value={value}/>
            </div>
            <button onClick={() => validate()}>Validate</button>
            <div id="hints">{hints.map((hint, idx) => <div key={idx}>{hint}</div>)}</div>
        </div>
    );
}