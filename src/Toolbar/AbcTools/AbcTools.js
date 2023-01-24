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

export function AbcTools({ addLayer }) {

    function onCreateNew() {
        const newLayer = {
            type: 'abc-render',
            name: 'ABC-Render',
            visible: true,
            notation: sheets[0]
        };
        addLayer(newLayer)
    }

    return (
        <>
            <span style={{ margin: '10px 0px', display: 'block' }}>Abc Tools</span>
            <button onClick={onCreateNew}>Open Editor</button>
        </>
    );
}