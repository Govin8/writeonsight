import { useState } from 'react';
import Tesseract from 'tesseract.js';

export default function ImageUpload({ setLoggedIn }) {
  const [ocrText, setOcrText] = useState("");
  const [ocrStatus, setOcrStatus] = useState("Upload an image to extract text.");

  const resetOcr = () => {
    setOcrText("");
    setOcrStatus("Upload an image to extract text.");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setOcrStatus("Processing image...");

    Tesseract.recognize(file, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          setOcrStatus(`Progress: ${Math.floor(m.progress * 100)}%`);
        }
      },
    })
      .then(({ data: { text } }) => {
        setOcrText(text);
        setOcrStatus("Text extraction complete.");
      })
      .catch((err) => {
        console.error(err);
        setOcrStatus("Failed to extract text.");
      });
  };

  return (
    <div className="container ocr-container">
      <button id="logout-btn" onClick={() => { setLoggedIn(false); resetOcr(); }}>Logout</button>
      <h2>OCR Tool</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <p id="ocr-status">{ocrStatus}</p>
      <textarea rows="6" placeholder="Extracted text will appear here..." value={ocrText} readOnly></textarea>
    </div>
  );
}