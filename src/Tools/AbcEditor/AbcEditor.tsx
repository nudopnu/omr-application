import React, { useEffect, useState } from "react";
import abcjs, { AbcVisualParams } from "abcjs";
import { DEFAULF_GENERATOR_SETTINGS, generateRandomSheet } from "../../lib/Sheet";
import "./AbcEditor.css";
import { AbcConverter } from '../../lib/Music/AbcUtils/AbcConverter';
import { SheetGenerator } from '../../lib/Music/SheetGenerator/SheetGenerator';
import { createRoot } from 'react-dom/client';
import { SvgFilter } from './SvgFilter';
import { AbcjsElements } from "../../lib/ElementClasses/AbcjsElements";
import { AbcjsElementType, AbcjsElementTypes } from "../../lib/ElementClasses/AbcjsElementTypes";
import { ThesisClasses } from "../../lib/ElementClasses/ThesisClasses";
import { BBox } from "../../lib/BBox";

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

let OutCounter = 1;

export function AbcEditor({ abcLayers, addLayer }) {
    const [value, setValue] = useState<string>(sheets[0]);
    const [hints, setHints] = useState<string[]>([]);
    const [checked, setChecked] = useState<boolean>(false);
    const [turbulenceFrequency, setTurbulenceFrequency] = useState<number>(0);
    const [turbulenceStrength, setTurbulenceStrength] = useState<number>(0);
    const [staffLineThickness, setStaffLineThickness] = useState<number>(1);
    const [verticalScale, setVerticalScale] = useState<number>(1);
    const [rotation, setRotation] = useState<number>(0);

    let definitionsRoot;

    const abcOptions: AbcVisualParams = {
        responsive: "resize",
        viewportVertical: true,
        add_classes: true,
        selectTypes: [],
        viewportHorizontal: true,
        format: {
            tripletfont: 'Maestro small bold',
            annotationfont: 'Maestro 10px bold',
        }
    };

    const relevantClasses = ThesisClasses;

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

        /* Inject filter defs */
        const abcContentContainer = document.querySelector('.abcjs-inner > svg') as HTMLElement;
        const defContainer = document.createElement('defs');
        abcContentContainer.appendChild(defContainer)
        definitionsRoot = createRoot(defContainer);
        definitionsRoot.render(<SvgFilter turbulenceFrequency={turbulenceFrequency} turbulenceStrength={turbulenceStrength} />);

        /* Apply filters */
        ([...document.querySelectorAll('svg > g')] as HTMLElement[]).forEach(element => {
            element.style.setProperty('filter', 'url(#displacementFilter)');
            element.style.setProperty('transform-box', 'fill-box');
        });

        /* Apply per-staff rotation */
        updateRotation();

        /* Apply 3d rotation */
        // (document.querySelector('svg') as SVGElement)
        //     .style
        //     .setProperty('transform', 'perspective(25cm) scale(.8) rotateX(4deg) rotateY(4deg)');

        /* Apply staff thickness */
        const scaleX = 1;
        scaleStafflines(scaleX, staffLineThickness);

        /* Add background paper */
        // const paper = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        // paper.setAttribute('width', '100%');
        // paper.setAttribute('height', '100%');
        // paper.style.setProperty('filter', 'url(#paper)');
        // abcContentContainer.insertBefore(paper, abcContentContainer.firstChild);

        /* Add background noise */
        const noise = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        noise.setAttribute('width', '100%');
        noise.setAttribute('height', '100%');
        noise.style.setProperty('filter', 'url(#noise)');
        // abcContentContainer.appendChild(noise);

    }

    function updateRotation() {
        ([...document.querySelectorAll('svg > g')] as HTMLElement[]).forEach(element => {
            element.style.setProperty('transform', `rotate(${rotation}deg) scale(1, ${verticalScale})`);
        });
    }

    function scaleStafflines(scaleX: number, scaleY: number) {
        ([...document.querySelectorAll('.abcjs-staff > path')] as HTMLElement[]).forEach(elem => {
            elem.style.setProperty("transform", `scale(${scaleX}, ${scaleY})`);
            elem.style.setProperty('transform-box', 'fill-box');
        });
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
    function onClickGenerateRandom2() {
        const sheet = SheetGenerator.generatePianoSheet();
        let abc = AbcConverter.fromSheet(sheet);
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
        let res = abcjs.renderAbc('abc-content', abc, abcOptions);
        console.log(res);

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
        const svgElement = document.querySelector('.abcjs-container > svg') as HTMLElement;
        svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");

        validate();

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
        const keys = AbcjsElementTypes
            .filter(key => relevantClasses.indexOf(key) !== -1)
            .filter(key => AbcjsElements[key])
            .sort(elem => AbcjsElements[elem]!.id);
        console.log("Processing classes:", keys);
        colorize(keys, true, abcClone);
        cloneElem.appendChild(abcClone);

        /* Generate gray-valued labels */
        abcClone = abcRef.cloneNode(true) as HTMLElement;
        abcClone.style.setProperty('background-color', '#000');
        abcClone.style.setProperty('height', '100%');
        const hexGrey = key => AbcjsElements[key].id.toString(16).padStart(2, '0')
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
        const pdf = await (window as any).page.print(url, String(OutCounter++).padStart(3, "0"), false);
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

    function validate(abcElem: HTMLElement = document.querySelector('#abc-render')!) {
        const keys = AbcjsElementTypes
            .filter(key => AbcjsElements[key])
            .sort(elem => AbcjsElements[elem]!.id);
        let hintText: string[] = [];
        let presentKeys: string[] = [];
        setHints(["Cheking..."])

        keys.forEach(key => {
            if (relevantClasses.indexOf(key) === -1) return;
            const { selector } = AbcjsElements[key]!;
            const selection = selector.query(abcElem);
            if (selection.length === 0)
                hintText.push(`[NOT FOUND]: ${key}`);
            else {
                presentKeys.push(key);
                selection.forEach(elem => elem.classList.add(key));
            }
        });

        if (hintText.length === 0) {
            hintText = ["All classes present"]
        }
        setHints(["Cheking...", ...hintText])
        return presentKeys;
    }

    function colorize(keys: AbcjsElementType[], flag, abcElem: HTMLElement = document.querySelector('#abc-render')!, getColor = (key => AbcjsElements[key].colors[1])) {
        keys.forEach(key => {
            const { selector } = AbcjsElements[key]!;
            selector.query(abcElem).forEach(elem => {
                (elem as HTMLElement).style.color = flag ? getColor(key) : '';
            });
        });

    }

    function createBoundingBoxes() {
        const abcElem = document.querySelector('.abcjs-container > svg') as HTMLElement;

        /* Needed to get svg-relative coordinate */
        const [parentX, parentY, parentW, parentH] = (abcElem as any).getAttribute("viewBox")
            .split(" ")
            .map(x => parseFloat(x));

        /* The svg container might not fill up the whole sheet -> fix with heightFactor */
        const { height: svgParentHeight } = abcElem.parentElement!.parentElement!.parentElement!.getBoundingClientRect();
        const { height: svgHeight } = abcElem.getBoundingClientRect();
        const heightFactor = svgHeight / svgParentHeight;

        /* Split beams */
        const { selector } = AbcjsElements.Beam!;
        selector.query(abcElem).forEach((elem, idx) => {
            const paths = elem.getAttribute('d')!
                .split('M')
                .filter(path => path.length > 0)
                .map(path => "M" + path);
            const children = paths.map(path => {
                const clone = elem.cloneNode() as SVGPathElement;
                clone.setAttribute("d", path);
                return clone;
            });
            elem.replaceWith(...children);
        });

        /* Create bounding boxes */
        const bboxes: BBox[] = [];
        let bboxContainer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        let id = 0;
        relevantClasses.forEach(key => {
            const { selector } = AbcjsElements[key]!;
            selector.query(abcElem).forEach((elem, idx) => {
                let { x, y, width, height } = (elem as any).getBBox();
                let cx = x + width / 2;
                let cy = y + height / 2;
                let res = { id: id++, type: key, x: x, y: y, width: width, height: height, cx: cx, cy: cy } as BBox;
                let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', x);
                rect.setAttribute('y', y);
                rect.setAttribute('width', width);
                rect.setAttribute('height', height);
                rect.setAttribute('fill', 'none');
                rect.setAttribute('stroke', '#00a');
                bboxContainer.appendChild(rect);

                [x, width] = [x, width].map(e => e / parentW);
                [y, height] = [y, height].map(e => (e / parentH) * heightFactor);
                cx = x + width / 2;
                cy = y + height / 2;
                res = { id: id++, type: key, x: x, y: y, width: width, height: height, cx: cx, cy: cy } as BBox;
                bboxes.push(res);
            });
        })
        abcElem.appendChild(bboxContainer);
        console.log(bboxes);

        /* Download as JSON */
        let data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bboxes));
        let downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', data);
        downloadAnchorNode.setAttribute('download', 'bboxes.json');
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    useEffect(() => {
        const keys = AbcjsElementTypes
            .filter(key => AbcjsElements[key])
            .sort(elem => AbcjsElements[elem]!.id);
        colorize(keys, checked);
    }, [checked])

    useEffect(() => {
        abcjs.renderAbc('abc-content', value, abcOptions);
        postProcess();
    }, [turbulenceFrequency, turbulenceStrength, staffLineThickness, rotation, verticalScale]);


    useEffect(() => {
        abcjs.renderAbc('abc-content', value, abcOptions);
        postProcess();
    }, [])

    return (
        <div id="abc-editor">
            <div id="abc-editor-inner">
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
                <button onClick={onClickGenerateRandom2}>Random Piano Sheet V2</button>
                <button onClick={onClickGenerateScale}>Scale Sheet</button>
                <button onClick={onClickGenerateOrnaments}>Ornaments Sheet</button>
                <button onClick={onClickConvert}>Convert to PNG</button>
                <button onClick={onClickConvert2}>Generate XY</button>
                <div id='settings'>
                    <div className='setting'>
                        <span>Staffline thickness:</span>
                        <input type="range" min={0.1} max={5} step={0.1} value={staffLineThickness} onChange={e => setStaffLineThickness(e.target.valueAsNumber)} />
                        {staffLineThickness}
                    </div>
                    <div className='setting'>
                        <span>Turbulence Frequency:</span>
                        <input type="range" min={0} max={0.1} step={0.001} value={turbulenceFrequency} onChange={e => setTurbulenceFrequency(e.target.valueAsNumber)} />
                        {turbulenceFrequency}
                    </div>
                    <div className='setting'>
                        <span>Turbulence Strength:</span>
                        <input type="range" min={0} max={10} step={0.1} value={turbulenceStrength} onChange={e => setTurbulenceStrength(e.target.valueAsNumber)} />
                        {turbulenceStrength}
                    </div>
                    <div className='setting'>
                        <span>Rotation:</span>
                        <input type="range" min={-3} max={3} step={0.1} value={rotation} onChange={e => setRotation(e.target.valueAsNumber)} />
                        {rotation}
                    </div>
                    <div className='setting'>
                        <span>Vertical Shrink:</span>
                        <input type="range" min={.5} max={1} step={0.1} value={verticalScale} onChange={e => setVerticalScale(e.target.valueAsNumber)} />
                        {verticalScale}
                    </div>
                </div>
                <button onClick={() => validate()}>Validate</button>
                <button onClick={createBoundingBoxes}>Create Bounding Boxes</button>
                <div id="hints">{hints.map((hint, idx) => <div key={idx}>{hint}</div>)}</div>
            </div>
        </div>
    );
}