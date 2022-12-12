import { AbcjsElementType } from "./AbcjsElementTypes";

export const ConvexHullCandidates: AbcjsElementType[] = [
    "AccidentalDoubleFlat",
    "AccidentalFlat",
    "AccidentalNatural",
    "AccidentalSharp",
    "AccidentalDoubleSharp",
    "TimeSig0",
    "TimeSig1",
    "TimeSig2",
    "TimeSig3",
    "TimeSig4",
    "TimeSig5",
    "TimeSig6",
    "TimeSig7",
    "TimeSig8",
    "TimeSig9",
    "TimeSig0",
    "TimeSigCommon",
    "TimeSigCutCommon",
    "Flag128thDown",
    "Flag64thDown",
    "Flag32ndDown",
    "Flag16thDown",
    "Flag8thDown",
    "Flag128thUp",
    "Flag64thUp",
    "Flag32ndUp",
    "Flag16thUp",
    "Flag8thUp",
];

interface Point {
    x: number;
    y: number;
}


export class ConvexHull {

    constructor(pathElem: SVGPathElement) {
        const n = Math.floor(pathElem.getTotalLength());
        const pathPoints = [...Array(n).keys()].map(i => pathElem.getPointAtLength(i));
        pathPoints.sort(ConvexHull.point_sort);
        const hull = ConvexHull.makeHullPresorted(pathPoints);
        let polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        for (let point of hull) {
            let point = DOMPoint.fromPoint({ x: 75, y: -50, z: -55, w: 0.25 });
            point.x = point[0];
            point.y = point[1];
            polygon.points.appendItem(point);
        }
    }

    static makeHullPresorted<P extends Point>(points: Readonly<Array<P>>): Array<P> {
        if (points.length <= 1)
            return points.slice();

        let upperHull: Array<P> = [];
        for (let i = 0; i < points.length; i++) {
            const p: P = points[i];
            while (upperHull.length >= 2) {
                const q: P = upperHull[upperHull.length - 1];
                const r: P = upperHull[upperHull.length - 2];
                if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x))
                    upperHull.pop();
                else
                    break;
            }
            upperHull.push(p);
        }
        upperHull.pop();

        let lowerHull: Array<P> = [];
        for (let i = points.length - 1; i >= 0; i--) {
            const p: P = points[i];
            while (lowerHull.length >= 2) {
                const q: P = lowerHull[lowerHull.length - 1];
                const r: P = lowerHull[lowerHull.length - 2];
                if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x))
                    lowerHull.pop();
                else
                    break;
            }
            lowerHull.push(p);
        }
        lowerHull.pop();

        if (upperHull.length === 1 && lowerHull.length === 1 && upperHull[0].x === lowerHull[0].x && upperHull[0].y === lowerHull[0].y)
            return upperHull;
        else
            return upperHull.concat(lowerHull);
    }

    static point_sort(a: Point, b: Point): number {
        if (a.x < b.x)
            return -1;
        else if (a.x > b.x)
            return +1;
        else if (a.y < b.y)
            return -1;
        else if (a.y > b.y)
            return +1;
        else
            return 0;
    }

}