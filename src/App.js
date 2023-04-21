import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import './App.css';

function App() {
  const [reportText, setReportText] = useState('');

  const handleFileSubmit = async (event) => {
    event.preventDefault();
    const file = event.target.elements.fileInput.files[0];

    // Use Tesseract.js to extract text from the uploaded image
    const { data: { text } } = await Tesseract.recognize(file);

    setReportText(text);
  };

  return (
    <div className="App">
      <h1>Medical Report Reader</h1>
      <form onSubmit={handleFileSubmit}>
        <input type="file" id="fileInput" />
        <button type="submit">Submit</button>
      </form>
      {reportText && <p>{reportText}</p>}
    </div>
  );
}

export default App;
