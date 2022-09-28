import { useState } from 'react';
import './App.css';
import { loadImage } from './lib/Image';
import { Toolbar } from './Toolbar/Toolbar';
import { WorkArea } from './WorkArea/WorkArea';

function App() {

  const [image, setImage] = useState(null);
  const [canvas, setCanvas] = useState(null);

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
      <Toolbar canvas={canvas} />
    </div>
  );
}

export default App;
