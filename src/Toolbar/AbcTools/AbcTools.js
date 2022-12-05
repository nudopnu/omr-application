export function AbcTools({ addLayer }) {

    function onCreateNew() {
        const newLayer = {
            type: 'abc-render',
            name: 'ABC-Render',
            visible: true,
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