import { useState } from 'react';
  import './App.css';
  
  const API_KEY = 'AIzaSyDXoH4e5JOoH3s6dQMMceYvhhygHSqfVWs';
  
  function App() {
    const [image, setImage] = useState(null);
    const [text, setText] = useState('');
    const [result, setResult] = useState();
    const [isLoading, setIsLoading] = useState(false);
  
    // Convert the image to text using Google Cloud Vision API
    const convertImageToText = async () => {
      try {
        setIsLoading(true);
        const base64Image = await convertImageToBase64(image);
        const extractedText = await analyzeImage(base64Image);
        console.log(extractedText); // Log the extracted text
        setText(extractedText);
        setResult(extractedText);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
  
    // Convert the image to base64 format
    const convertImageToBase64 = (image) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(image);
      });
    };
  
    // Analyze the image using Google Cloud Vision API
    const analyzeImage = (base64Image) => {
      const body = JSON.stringify({
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              {
                type: 'TEXT_DETECTION',
                maxResults: 10,
              },
            ],
          },
        ],
      });
  
      return fetch(`https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      })
        .then((response) => response.json())
        .then((data) => {
          const extractedText = data.responses[0]?.textAnnotations[0]?.description;
          return extractedText || 'No text found.';
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    };
  
    // Handle image change event
    const handleChangeImage = (event) => {
      const selectedImage = event.target.files[0];
      setImage(selectedImage);
    };
  
    return (
      <div className="App">
        <h1>ImText</h1>
        <p>Get words in the image!</p>
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
          {isLoading ? <p>Wait for a few seconds...</p> : <p>{result}</p>}
        </div>
      </div>
    );
  }
  
  export default App;
  
