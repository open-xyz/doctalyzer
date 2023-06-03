import { useState } from 'react';
import Tesseract from 'tesseract.js';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // Convert the image to text using Tesseract OCR
  const convertImageToText = async () => {
    try {
      setIsLoading(true); 
      const { data } = await Tesseract.recognize(image, "eng");
      const extractedText = data.text;
      console.log(extractedText);
      setText(extractedText);
      setResult(extractedText);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle image change event
  const handleChangeImage = e => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  }

  return (
    <div className="App">
      <h1>ImText</h1>
      <p>Gets words in image!</p>
      <div className="input-wrapper">
        <label htmlFor="upload">Upload Image</label>
        <input type="file" id="upload" accept="image/*" onChange={handleChangeImage} />
      </div>

      <div className="result">
        <button onClick={convertImageToText}>Click</button>
        <textarea value={text} readOnly></textarea>
      </div>

      <div className="stored-result">
        <h3>Stored Result:</h3>
        {/* Display a loading message while the result is being processed */}
        {isLoading ? (
          <p>Wait for a few seconds...</p>
        ) : (
          <p>{result}</p>
        )}
      </div>
    </div>
  );
}

export default App;
