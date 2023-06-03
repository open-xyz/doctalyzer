
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import './App.css';

require('dotenv').config();


function App() {
  const [reportText, setReportText] = useState('');
  const [interpretedReportText, setInterpretedReportText] = useState('');
  const [chatGPTApiKey, setChatGPTApiKey] = useState(process.env.REACT_APP_CHATGPT_API_KEY);

  const handleFileSubmit = async (event) => {
    event.preventDefault();
    console.log("Submit button clicked"); // add this line to see if the function is being called

    const file = event.target.elements.fileInput.files[0];

    // Use Tesseract.js to extract text from the uploaded image
    const { data: { text } } = await Tesseract.recognize(file);

    setReportText(text);
  };

  const handleInterpretationSubmit = async (event) => {
    event.preventDefault();



    // Make a request to the ChatGPT API to interpret the medical report in simple language
    const response = await fetch('https://api.chatgpt.com/interpret', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${chatGPTApiKey}`,
      },
      body: JSON.stringify({
        reportText,
      }),
    });

    const data = await response.json();
    setInterpretedReportText(data.interpretedReportText);
    console.log(data);
  };

  return (
    <div className="App">
      <h1>Medical Report Reader</h1>
      <form onSubmit={handleFileSubmit}>
        <input type="file" id="fileInput" />
        <button type="submit">Submit</button>
      </form>
      {reportText && (
        <form onSubmit={handleInterpretationSubmit}>
          <textarea value={reportText} onChange={(event) => setReportText(event.target.value)} />
          <button type="submit">Interpret</button>
        </form>
      )}
      {interpretedReportText && <p>{interpretedReportText}</p>}
    </div>
  );
}

export default App;
