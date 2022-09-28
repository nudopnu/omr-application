import { useState } from 'react';
import './App.css';
import { Toolbar } from './Toolbar/Toolbar';
import { WorkArea } from './WorkArea/WorkArea';
// import { Image } from 'image-js';

function App() {

  const [image, setImage] = useState(null);
  const [canvas, setCanvas] = useState(null);

  const buildRgb = (imageData) => {
    let rgbValues = [];

    let lastfound = {};
    // note that we are loopin every 4!
    // for every Red, Green, Blue and Alpha
    for (let i = 0; i < imageData.length; i += 4) {
      const rgb = {
        r: imageData[i],
        g: imageData[i + 1],
        b: imageData[i + 2],
      };

      let str = Object.values(rgb).join("");
      if (!lastfound.hasOwnProperty(str)) {
        rgbValues.push(rgb);
        lastfound[str] = i;
      }
    }
    return rgbValues;
  };


  async function onOpenFiles(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e) => {
        const fakeImage = new Image();
        setImage(e.target.result);
        fakeImage.src = e.target.result

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        fakeImage.onload = () => {
          canvas.width = fakeImage.width;
          canvas.height = fakeImage.height;
          ctx.drawImage(fakeImage, 0, 0);
          setCanvas(canvas);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          console.log("Drawing", buildRgb(imageData.data));
        }
      };
      reader.readAsDataURL(file);
    }
  }


  return (
    <div className="App">
      <WorkArea image={image} onOpenFiles={onOpenFiles} />
      <Toolbar canvas={canvas}/>
    </div>
  );
}

export default App;
