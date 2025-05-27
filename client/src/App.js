import React, { useState } from "react";
import { createWorker } from "tesseract.js";
import ImageUpload from "./components/ImageUpload";

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = async (src, file) => {
    setImageSrc(src);
    setText(""); // Clear old result
    setLoading(true);

    const worker = await createWorker("eng");

    const {
      data: { text: extractedText },
    } = await worker.recognize(file);

    await worker.terminate();

    setText(extractedText);
    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", margin: "2rem" }}>
      <h1>📷 WriteOnSight OCR</h1>
      <ImageUpload onImageChange={handleImageChange} />
      {imageSrc && <img src={imageSrc} alt="preview" width="300px" />}
      {loading && <p>🔄 Extracting text...</p>}
      {text && (
        <>
          <h3>📄 Extracted Text:</h3>
          <pre>{text}</pre>
        </>
      )}
    </div>
  );
}

export default App;
