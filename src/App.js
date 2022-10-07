import { useState } from 'react';
import './App.css';
import { loadImage } from './lib/Image';
import { ColorLayers } from './Toolbar/ColorLayers/ColorLayers';
import { ModelPicker } from './Toolbar/ModelPicker/ModelPicker';
import { Toolbar } from './Toolbar/Toolbar';
import { WorkArea } from './WorkArea/WorkArea';

function App() {

  // image is the original one, tmp is whats displayed
  const [image, setImage] = useState(null);
  const [tmpImage, settmpImage] = useState(null);

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
    res = "data:image/png;base64," + res.slice(2, -1)
    setImage(res);
    console.log(res);
  }

  async function onOpenFiles(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const { canvas, dataUrl } = await loadImage(file, null);
      setImage(dataUrl)
      setCanvas(canvas)
    }
  }

  return (
    <div className="App">
      <WorkArea image={image} onOpenFiles={onOpenFiles}>
        <img src={image} alt="" draggable="false" />
      </WorkArea>
      <Toolbar canvas={canvas}>
        <ModelPicker
          onModelSelect={onModelSelect}
          onRequestPrediction={onRequestPrediction}
          isModelLoaded={isModelLoaded}
          isPredicting={isPredicting}
        />
        {/* {canvas && <ColorLayers canvas={canvas} updateImage={setImage} />} */}
      </Toolbar>
    </div>
  );
}

export default App;
