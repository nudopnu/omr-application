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
  const [tmpImage, settmpImage] = useState(null);
  const [layers, setLayers] = useState([]);

  // Prediction
  const [canvas, setCanvas] = useState(null);
  const [isPredicting, setPredicting] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  async function onModelSelect(modelName) {
    console.log(modelName);
    await window.predict.sendCommand("loadModel", modelName);
    setIsModelLoaded(true);
    console.log("SETTING MODEL", modelName);
  }

  async function onRequestPrediction() {
    setPredicting(true);
    let res = await window.predict.sendCommand("predict", canvas.toDataURL().split(",")[1]);
    setPredicting(false);
    res = res.payload;
    let dataUrl = "data:image/png;base64," + res.slice(2, -1)
    setImage(dataUrl);
    console.log(dataUrl);
    const newLayer = {
      type: 'base64ImageUrl',
      name: 'Prediction',
      visible: true,
      src: dataUrl
    };
    setLayers([
      ...layers,
      newLayer
    ])
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
          onModelSelect={onModelSelect}
          onRequestPrediction={onRequestPrediction}
          isModelLoaded={isModelLoaded}
          isPredicting={isPredicting}
        />
        <LayerPicker layers={layers} />
        {/* {canvas && <ColorLayers canvas={canvas} updateImage={setImage} />} */}
        <ColorPicker />
      </Toolbar>
    </div>
  );
}

export default App;
