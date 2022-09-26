import { useState } from 'react';
import './App.css';
import { WorkArea } from './WorkArea/WorkArea';
// import { Image } from 'image-js';

function App() {

  const [image, setImage] = useState(null);

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

      // First try
      // console.log("Trying to read ", file);
      // const buffer = await readFileAsync(file);
      // let image = await Image.load(buffer);
      // setImage(image);

      // Alternative
      const reader = new FileReader();
      reader.onload = (e) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const fakeImage = new Image();
        setImage(e.target.result);
        fakeImage.src = e.target.result
        fakeImage.onload = () => {
          canvas.width = fakeImage.width;
          canvas.height = fakeImage.height;
          ctx.drawImage(fakeImage, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          console.log("Drawing", buildRgb(imageData.data));
        }
      };
      reader.readAsDataURL(file);
    }
  }

  (async () => {
    const res = await window.classification.getModels();
    console.log(res);
  })()

  return (
    <div className="App">
      <WorkArea image={image} onOpenFiles={onOpenFiles} />
      <div>{window.versions.chrome()}</div>
    </div>
  );
}

export default App;
