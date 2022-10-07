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

  // 
  const [canvas, setCanvas] = useState(null);
  const [isPredicting, setPredicting] = useState(false);

  async function onOpenFiles(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const { canvas, dataUrl } = await loadImage(file, null);
      setImage(dataUrl)
      setCanvas(canvas)
    }
    console.log("STARTING")
    let res = await window.json.start();
    console.log("End STARTING")
    console.log(await window.json.sendCommand({"this": "object"}));
  }

  function onRequestPrediction(modelName) {
    setPredicting(true);
    (async () => {
      let res = await window.python.predict(modelName, canvas.toDataURL());
      console.log(res);
      setPredicting(false);
      alert(res)
    })();
  }

  return (
    <div className="App">
      <WorkArea image={image} onOpenFiles={onOpenFiles}>
        <img src={image} alt="" draggable="false" />
      </WorkArea>
      <Toolbar canvas={canvas}>
        <ModelPicker onRequestPrediction={onRequestPrediction} />
        {/* {canvas && <ColorLayers canvas={canvas} updateImage={setImage} />} */}
      </Toolbar>
    </div>
  );
}

export default App;
