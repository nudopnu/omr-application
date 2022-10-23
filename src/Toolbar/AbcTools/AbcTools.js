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
            <span>Abc Tools</span>
            <button onClick={onCreateNew}>Create New</button>
        </>
    );
}