import { useState } from 'react';
import './App.css';
import { Layers } from './Layers/Layers';
import { loadImage } from './lib/Image';
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
      ])
    }
  }

  return (
    <div className="App">
      <WorkArea image={image} onOpenFiles={onOpenFiles}>
        <Layers layers={layers} />
      </WorkArea>
      <Toolbar canvas={canvas}>
        <ModelPicker
          getImage={getImage}
          addLayer={addLayer}
        />
        <LayerPicker layers={layers} replaceLayer={replaceLayer} deleteLayer={deleteLayer} />
        <ColorPicker addLayer={addLayer} />
      </Toolbar>
    </div>
  );
}

export default App;
