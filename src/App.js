import './App.css';
import { FilePicker } from './FilePicker/FilePicker';
import { useState } from 'react';
import { WorkArea } from './WorkArea/WorkArea';
import { Image } from 'image-js';


function App() {

  const [image, setImage] = useState(null);

  function readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    })
  }

  async function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log("Trying to read ", file);
      const buffer = await readFileAsync(file);
      let image = await Image.load(buffer);
      // image = image.grey();
      setImage(image);
    }
  }

  return (
    <div className="App">
      <WorkArea image={image} />
      <FilePicker onFilesReceive={handleFiles} />
    </div>
  );
}

export default App;
