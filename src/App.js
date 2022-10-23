import { useState } from 'react';
import { AbcEditor } from './AbcEditor/AbcEditor';
import './App.css';
import { Layers } from './Layers/Layers';
import { loadImage } from './lib/Image';
import { AbcTools } from './Toolbar/AbcTools/AbcTools';
import { ColorPicker } from './Toolbar/ColorPicker/ColorPicker';
import { LayerPicker } from './Toolbar/LayerPicker/LayerPicker';
import { ModelPicker } from './Toolbar/ModelPicker/ModelPicker';
import { Toolbar } from './Toolbar/Toolbar';
import { WorkArea } from './WorkArea/WorkArea';

function App() {

  // image is the original one, tmp is whats displayed
  const [image, setImage] = useState(null);
  const [layers, setLayers] = useState([]);

  // Prediction
  const [canvas, setCanvas] = useState(null);

  function getImage() {
    return canvas.toDataURL().split(",")[1];
  }

  function addLayer(newLayer) {
    setLayers([
      ...layers,
      newLayer
    ]);
  }

  function replaceLayer(index, mapfunc) {
    let newLayers = []
    layers.forEach((layer, idx) => {
      if (idx !== index) {
        newLayers.push(layer);
      } else {
        newLayers.push(mapfunc(layer));
      }
    });
    setLayers(newLayers);
  }

  function deleteLayer(index) {
    let newLayers = layers.filter((layer, idx) => idx !== index)
    setLayers(newLayers);
  }

  async function onOpenFiles(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const { canvas, dataUrl } = await loadImage(file, null);
      setImage(dataUrl)
      setCanvas(canvas)
      const newLayer = {
        type: 'base64ImageUrl',
        name: 'Original',
        visible: true,
        src: dataUrl
      };
      setLayers([
        newLayer
      ]);
    }
  }

  return (
    <div className="App">
      <WorkArea onOpenFiles={onOpenFiles} layers={layers}>
        <Layers layers={layers} />
      </WorkArea>
      {layers.filter(layer => layer.type === 'abc-render').length > 0 && <AbcEditor abcLayers={layers.filter(layer => layer.type === 'abc-render')} />}
      <Toolbar canvas={canvas}>
        <ModelPicker
          getImage={getImage}
          addLayer={addLayer}
        />
        <LayerPicker layers={layers} replaceLayer={replaceLayer} deleteLayer={deleteLayer} />
        <ColorPicker addLayer={addLayer} />
        <AbcTools addLayer={addLayer} />
      </Toolbar>
    </div>
  );
}

export default App;
