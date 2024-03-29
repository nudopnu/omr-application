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
import { FileDrop } from "../../common/FileDrop/FileDrop";
import { JobList } from "../../common/Jobs/Joblist";
import { IJob } from "../../common/Jobs/Job";
import { ConversionJob } from "../../common/Jobs/ConversionJob";
import { AbcLayer } from "../../Main/Layers/Layer";
import { KeySignature } from "../../lib/Music/Sheet/KeySignature";

let OutCounter = 1;

export function AbcEditor({ abcLayers, addLayer }) {
    let initSheet = (abcLayers[0] as AbcLayer).notation;
    const [value, setValue] = useState<string>(initSheet);
    const [visualObj, setVisObjects] = useState<any>(null);
    const [jobs, setJobs] = useState<IJob[]>([]);
    const [hints, setHints] = useState<string[]>([]);
    const [checked, setChecked] = useState<boolean>(false);
    const [turbulenceFrequency, setTurbulenceFrequency] = useState<number>(0);
    const [turbulenceStrength, setTurbulenceStrength] = useState<number>(0);
    const [staffLineThickness, setStaffLineThickness] = useState<number>(1);
    const [verticalScale, setVerticalScale] = useState<number>(1);
    const [rotation, setRotation] = useState<number>(0);

    // This object is the class that will contain the buffer
    let midiBuffer;


    function startAudio() {
        var startAudioButton = document.querySelector(".activate-audio")!;
        var stopAudioButton = document.querySelector(".stop-audio")!;
        var statusDiv = document.querySelector(".status")!;
        var audioError = document.querySelector(".audio-error")!;

        startAudioButton!.setAttribute("style", "display:none;");
        // statusDiv!.innerHTML = "<div>Testing browser</div>";
        if (abcjs.synth.supportsAudio()) {
            stopAudioButton.setAttribute("style", "");

            // An audio context is needed - this can be passed in for two reasons:
            // 1) So that you can share this audio context with other elements on your page.
            // 2) So that you can create it during a user interaction so that the browser doesn't block the sound.
            // Setting this is optional - if you don't set an audioContext, then abcjs will create one.
            var audioContext = new window.AudioContext();
            audioContext.resume().then(function () {
                // statusDiv.innerHTML += "<div>AudioContext resumed</div>";
                // In theory the AC shouldn't start suspended because it is being initialized in a click handler, but iOS seems to anyway.

                // This does a bare minimum so this object could be created in advance, or whenever convenient.
                midiBuffer = new abcjs.synth.CreateSynth();

                // midiBuffer.init preloads and caches all the notes needed. There may be significant network traffic here.
                console.log(visualObj);
                
                return midiBuffer.init({
                    visualObj: visualObj,
                    audioContext: audioContext,
                    millisecondsPerMeasure: visualObj.millisecondsPerMeasure()
                }).then(function (response) {
                    console.log("Notes loaded: ", response)
                    // statusDiv.innerHTML += "<div>Audio object has been initialized</div>";
                    // console.log(response); // this contains the list of notes that were loaded.
                    // midiBuffer.prime actually builds the output buffer.
                    return midiBuffer.prime();
                }).then(function (response) {
                    // statusDiv.innerHTML += "<div>Audio object has been primed (" + response.duration + " seconds).</div>";
                    // statusDiv.innerHTML += "<div>status = " + response.status + "</div>"
                    // At this point, everything slow has happened. midiBuffer.start will return very quickly and will start playing very quickly without lag.
                    midiBuffer.start();
                    // statusDiv.innerHTML += "<div>Audio started</div>";
                    return Promise.resolve();
                }).catch(function (error) {
                    if (error.status === "NotSupported") {
                        stopAudioButton.setAttribute("style", "display:none;");
                        var audioError = document.querySelector(".audio-error");
                        audioError!.setAttribute("style", "");
                    } else
                        console.warn("synth error", error);
                });
            });
        } else {
            audioError = document.querySelector(".audio-error")!;
            audioError.setAttribute("style", "");
        }
    };


    function stopAudio() {
        var startAudioButton = document.querySelector(".activate-audio")!;
        var stopAudioButton = document.querySelector(".stop-audio")!;
        startAudioButton.setAttribute("style", "");
        stopAudioButton.setAttribute("style", "display:none;");
        if (midiBuffer)
            midiBuffer.stop();
    }

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



    function postProcess() {

        // addAugmentation();
        // abcContentContainer.appendChild(noise);

        const abcElem = document.querySelector('.abcjs-container > svg') as HTMLElement;

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

        /* Assign System numbers */
        document.querySelectorAll("svg > g")
            .forEach((e, idx) => e.setAttribute("system", idx.toString()));

        let idx = 1;
        relevantClasses.forEach(key => {
            const { selector } = AbcjsElements[key]!;
            [...new Set(selector.query(abcElem))].forEach(elem => {
                if (elem.hasAttribute("elem-id"))
                    return
                elem.setAttribute("elem-id", (idx++).toString());
            });
        })

        setHints(["Postprocessing completed."]);
    }

    function addAugmentation() {

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

        /* Inject filter defs */
        const abcContentContainer = document.querySelector('.abcjs-inner > svg') as HTMLElement;
        const defContainer = document.createElement('defs');
        abcContentContainer.appendChild(defContainer);
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
    }

    function onClickGenerateRandom() {
        let abc = generateRandomSheet(DEFAULF_GENERATOR_SETTINGS.settings);
        setAbcString(abc);
    }
    function onClickGenerateRandom2() {
        const sheet = SheetGenerator.generatePianoSheet();
        let abc = AbcConverter.fromSheet(sheet);
        setAbcString(abc);
    }

    function onClickGenerateScale() {
        const sheet = SheetGenerator.generateScaleSheet();
        let abc = AbcConverter.fromSheet(sheet);
        setAbcString(abc);
    }

    function onClickMock() {
        const sheet = SheetGenerator.generateMockSheet();
        const CIonian = new KeySignature('C', 'Ionian');
        console.log(sheet);
        console.log(CIonian);
        let abc = AbcConverter.fromSheet(sheet);
        setAbcString(abc);
    }

    function onClickGenerateOrnaments() {
        const sheet = SheetGenerator.generateOrnamentsSheet();
        let abc = AbcConverter.fromSheet(sheet);
        setAbcString(abc);
    }

    function handleChange(event) {
        setValue(event.target.value);
        let visObjects = abcjs.renderAbc('abc-content', event.target.value, abcOptions);
        setVisObjects(visObjects[0]);
        postProcess();
        setChecked(false);
        setHints(["Validation required."]);
    }

    function setAbcString(abc: string) {
        console.log(abc);
        setValue(abc);
        setChecked(false);
        let visObjects = abcjs.renderAbc('abc-content', abc, abcOptions);
        setVisObjects(visObjects[0]);
        postProcess();
        validate();
    }


    async function onClickGenerateXY(name?: string) {
        const svgElement = document.querySelector('.abcjs-container > svg') as HTMLElement;
        svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");

        postProcess();
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
        // const hexGrey = key => AbcjsElements[key].id.toString(16).padStart(2, '0')
        // colorize(keys, true, abcClone, (_key, idx) => `#${hexGrey(idx)}${hexGrey(idx)}${hexGrey(idx)}`);
        colorize(keys, true, abcClone, (_key, idx) => `#${idx.toString(16).padStart(6, '0')}`);
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
        name = !name ? String(OutCounter++).padStart(3, "0") : name;
        const pdf = await (window as any).page.print(url, name, false);
        hintText = [...hintText, "Done."]
        setHints(hintText)

        /* Convert pdf to png using ImageMagick */
        hintText = [...hintText, "Converting to PNG..."]
        setHints(hintText)
        const dpi = 280;
        await (window as any).page.pdf2png(pdf, name, dpi);
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

    function colorize(keys: AbcjsElementType[], flag, abcElem: HTMLElement = document.querySelector('#abc-render')!, getColor = ((key, idx?) => AbcjsElements[key].colors[1])) {
        let idx = 1;

        keys.forEach(key => {
            const { selector } = AbcjsElements[key]!;
            selector.query(abcElem).forEach(elem => {
                (elem as HTMLElement).style.color = flag ? getColor(key, idx++) : '';
            });
        });

    }

    function getSystemId(elem): number {
        if (!elem.parentElement || elem.parentElement.tagName === "svg")
            return -1;
        if (elem.parentElement.hasAttribute("system"))
            return elem.parentElement.getAttribute("system");
        return getSystemId(elem.parentElement);
    }

    function createBoundingBoxes(filename?: string) {
        const abcElem = document.querySelector('.abcjs-container > svg') as HTMLElement;

        /* Needed to get svg-relative coordinate */
        const [, , parentW, parentH] = (abcElem as any).getAttribute("viewBox")
            .split(" ")
            .map(x => parseFloat(x));

        /* The svg container might not fill up the whole sheet -> fix with heightFactor */
        const { height: svgParentHeight } = abcElem.parentElement!.parentElement!.parentElement!.getBoundingClientRect();
        const { height: svgHeight } = abcElem.getBoundingClientRect();
        const heightFactor = svgHeight / svgParentHeight;

        /* Create bounding boxes */
        const bboxes: BBox[] = [];
        const bboxContainer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        let alreadyVisited = new Set();
        relevantClasses
            .sort(elem => AbcjsElements[elem]!.id)
            .forEach(classname => {
                const { selector } = AbcjsElements[classname]!;
                selector.query(abcElem).forEach((elem, idx) => {
                    if (alreadyVisited.has(elem)) return;
                    const systemId = getSystemId(elem);
                    const elemId = parseInt(elem.getAttribute("elem-id")!)
                    let res = createBoundingBox(elem, elemId, classname, systemId, bboxContainer, parentW, parentH, heightFactor);
                    bboxes.push(res);
                    alreadyVisited.add(elem);
                });
            })
        abcElem.querySelectorAll("[system]").forEach(elem => {
            const systemId = parseInt(elem.getAttribute("system")!);
            let res = createBoundingBox((elem as HTMLElement), systemId, "System", systemId, bboxContainer, parentW, parentH, heightFactor);
            bboxes.push(res);
            console.log(res);

        });
        abcElem.appendChild(bboxContainer);
        console.log(bboxes);

        /* Save as file if filename provided */
        if (filename) {
            (window as any).file.writeFile(`${filename}`, JSON.stringify(bboxes));
            return;
        }

        /* Download as JSON otherwise */
        let data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bboxes));
        let downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', data);
        downloadAnchorNode.setAttribute('download', 'bboxes.json');
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    function createBoundingBox(elem: HTMLElement, elemId: number, classname: string, systemId: number, bboxContainer: SVGGElement, parentW: any, parentH: any, heightFactor: number) {
        /* Get bounding box data */
        let { x, y, width, height } = (elem as any).getBBox();
        let cx = x + width / 2;
        let cy = y + height / 2;
        let res = { id: elemId, type: classname, x: x, y: y, width: width, height: height, cx: cx, cy: cy, systemId: systemId } as BBox;

        /* Draw rect around it */
        let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        rect.setAttribute('fill', 'none');
        rect.setAttribute('stroke', '#00a');
        bboxContainer.appendChild(rect);

        /* Make coordinates relative to parent */
        [x, width] = [x, width].map(e => e / parentW);
        [y, height] = [y, height].map(e => (e / parentH) * heightFactor);
        cx = x + width / 2;
        cy = y + height / 2;
        res = { id: elemId, type: classname, x: x, y: y, width: width, height: height, cx: cx, cy: cy, instanceColor: `#${elemId.toString(16).padStart(6, '0')}`, systemId: systemId } as BBox;
        return res;
    }

    function getClassList(filename?: string) {
        const json = relevantClasses
            .sort((a, b) => AbcjsElements[a]!.id - AbcjsElements[b]!.id)
            .map((c, idx) => ({ class: c, color: AbcjsElements[c]?.colors[1], dsid: AbcjsElements[c]?.id, id: idx + 1 }));

        if (filename) {
            (window as any).file.writeFile(filename, JSON.stringify(json));
            return;
        }

        /* Download as JSON */
        let data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
        let downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', data);
        downloadAnchorNode.setAttribute('download', 'classlist.json');
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    function downloadSVGFile() {
        const svg = document.querySelector('.abcjs-inner > svg')!;

        //get svg source.
        var serializer = new XMLSerializer();
        var source = serializer.serializeToString(svg);

        //add name spaces.
        if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }

        //add xml declaration
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

        //convert svg source to URI data scheme.
        var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

        let downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', url);
        downloadAnchorNode.setAttribute('download', 'sheet.svg');
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    function onFilesReceive(files: FileList) {
        interface FileWithPath extends File {
            path: string;
        }

        setJobs([...files].map(file => new ConversionJob(file.name, (settings) => new Promise(async (resolve, reject) => {
            const path = (file as FileWithPath).path
            console.log(path);
            const abc = await (window as any).file.readFile(path);
            console.log(settings)
            await setAbcString(abc);
            if (settings.PDF.enabled)
                await onClickGenerateXY(file.name.split(".")[0]);
            if (settings.BOUNDING_BOX.enabled)
                createBoundingBoxes(file.name.split(".")[0] + ".json");
            console.log(file.name + "done!");
            resolve('done');
        }))))
    }

    useEffect(() => {
        const keys = AbcjsElementTypes
            .filter(key => AbcjsElements[key])
            .sort(elem => AbcjsElements[elem]!.id);
        colorize(keys, checked);
    }, [checked])

    useEffect(() => {
        const visObjs = abcjs.renderAbc('abc-content', value, abcOptions);
        setVisObjects(visObjs[0]);
        postProcess();
    }, [turbulenceFrequency, turbulenceStrength, staffLineThickness, rotation, verticalScale]);


    useEffect(() => {
        abcjs.renderAbc('abc-content', value, abcOptions);
        postProcess();
    }, []);

    return (
        <div id="abc-editor">
            <div id="abc-editor-inner">
                <textarea value={value} onChange={handleChange} id="" cols={30} rows={10}></textarea>
                {/* <p className="suspend-explanation">Browsers won't allow audio to work unless the audio is started in response to a
                    user action. This prevents auto-playing web sites. Therefore, the
                    following button is needed to do the initialization:</p> */}
                <div className="row">
                    <div>
                        <button className="activate-audio" onClick={startAudio}>Play Tune</button>
                        <button className="stop-audio" onClick={stopAudio} style={{ display: "none" }}>Stop Audio</button>
                        <div className='audio-error' style={{ display: "none" }}>Audio is not supported in this browser.</div>
                    </div>
                    <div className="status"></div>
                </div>
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
                <button onClick={onClickMock}>Mock Response</button>
                <button onClick={onClickGenerateOrnaments}>Ornaments Sheet</button>
                <button onClick={onClickConvert}>Convert to PNG</button>
                {/* <input type="text" value={name} /> */}
                <button onClick={() => onClickGenerateXY()}>Generate XY</button>
                <FileDrop instruction="Drop abc files here" onFilesReceive={onFilesReceive} />
                <JobList jobs={jobs} />
                {/* <div id='settings'>
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
                </div> */}
                <button onClick={() => validate()}>Validate</button>
                <button onClick={() => createBoundingBoxes()}>Create Bounding Boxes</button>
                <button onClick={() => getClassList()}>Get Classlist</button>
                <button onClick={() => downloadSVGFile()}>Download SVG</button>
                <div id="hints">{hints.map((hint, idx) => <div key={idx}>{hint}</div>)}</div>
            </div>
        </div>
    );
}