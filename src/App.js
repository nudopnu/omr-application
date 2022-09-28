import { useState } from 'react';
import './App.css';
import { getDistinctColors, loadImage } from './lib/Image';
import { Toolbar } from './Toolbar/Toolbar';
import { WorkArea } from './WorkArea/WorkArea';
// import { Image } from 'image-js';

function App() {

  const [image, setImage] = useState(null);
  const [canvas, setCanvas] = useState(null);

  async function onOpenFiles(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const { canvas, dataUrl } = await loadImage(file, null);
      setImage(dataUrl)
      console.log(canvas);
      setCanvas(canvas)
      // const reader = new FileReader();
      // reader.onload = (e) => {
      //   setImage(e.target.result);
      //   const fakeImage = new Image();
      //   fakeImage.src = e.target.result

      //   const canvas = document.createElement("canvas");
      //   fakeImage.onload = () => {
      //     canvas.width = fakeImage.width;
      //     canvas.height = fakeImage.height;

      //     const ctx = canvas.getContext("2d");
      //     ctx.drawImage(fakeImage, 0, 0);
      //     setCanvas(canvas);
      //     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      //     console.log("Drawing", getDistinctColors(imageData.data));
      //   }
      // };
      // reader.readAsDataURL(file);
    }
  }


  return (
    <div className="App">
      <WorkArea image={image} onOpenFiles={onOpenFiles} />
      <Toolbar canvas={canvas} />
    </div>
  );
}

export default App;
