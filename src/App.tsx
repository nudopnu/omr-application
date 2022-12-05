import React from 'react';

import { useState } from 'react';
import { AbcEditor } from './Tools/AbcEditor/AbcEditor';
import './App.css';
import { ImageLayer, LayerUT as uLayer } from './Main/Layers/Layer';
import { Layers } from './Main/Layers/Layers';
import { loadImage, uriToCanvas } from './lib/Image';
import { AbcTools } from './Toolbar/AbcTools/AbcTools';
import { ColorPicker } from './Toolbar/ColorPicker/ColorPicker';
import { LayerPicker } from './Toolbar/LayerPicker/LayerPicker';
import { ModelPicker } from './Toolbar/ModelPicker/ModelPicker';
import { Toolbar } from './Toolbar/Toolbar';
import { WorkArea } from './Main/WorkArea/WorkArea';

function App() {

  // image is the original one, tmp is whats displayed
  const [image, setImage] = useState<string>("");
  const [layers, setLayers] = useState<uLayer[]>([]);

  // Prediction
  const [canvas, setCanvas] = useState(null);

  function getImage() {
    console.log(canvas);
    if (!canvas) {
      throw new Error("Canvas not ready!");
    }
    return (canvas as HTMLCanvasElement).toDataURL().split(",")[1];
  }

  async function addLayer(newLayer) {
    if (layers.filter(layer => layer.type === 'base64ImageUrl').length === 0 && newLayer.type === 'base64ImageUrl') {
      setImage(newLayer.src);
      const canvas = await uriToCanvas(newLayer.src);
      setCanvas(canvas);
    }
    const newLayers = [
      ...layers,
      newLayer
    ];
    setLayers(newLayers);
    console.log(newLayers);
  }

  function replaceLayer(index, mapfunc) {
    let newLayers: uLayer[] = [];
    layers.forEach((layer, idx) => {
      if (idx !== index) {
        newLayers.push(layer);
      } else {
        newLayers.push(mapfunc(layer));
      }
    });
    setLayers(newLayers);
  }

  async function deleteLayer(index) {
    if (layers[index].type === 'base64ImageUrl') {
      const remainingImages: ImageLayer[] = layers.filter(layer => layer.type === 'base64ImageUrl');
      if (remainingImages.length > 0) {
        setImage(remainingImages[0].src);
        const canvas = await uriToCanvas(remainingImages[0].src);
        setCanvas(canvas);
      }
    }
    let newLayers = layers.filter((layer, idx) => idx !== index);
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
      <WorkArea onOpenFiles={onOpenFiles} layers={layers} addLayer={addLayer}>
        <Layers layers={layers} />
      </WorkArea>
      {layers.filter(layer => layer.type === 'abc-render').length > 0 &&
        <AbcEditor abcLayers={layers.filter(layer => layer.type === 'abc-render')} addLayer={addLayer} />
      }
      <Toolbar>
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
