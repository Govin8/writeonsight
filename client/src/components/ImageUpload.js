import { useState } from 'react';
import Tesseract from 'tesseract.js';

export default function ImageUpload() {
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
    <div 
      className="container ocr-container"
      style={{
        background: 'linear-gradient(145deg, #ffffff, #f1f5f9)',
        padding: '3rem 2.5rem',
        borderRadius: '20px',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
        maxWidth: '450px',
        width: '90%',
        margin: '0 auto 3rem',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '500px',
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <h2 
        style={{
          marginBottom: '1.8rem',
          fontSize: '1.75rem',
          textAlign: 'center',
          fontWeight: '700',
          color: '#1e293b',
          letterSpacing: '0.03em',
          background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'fadeIn 1s ease-in-out',
        }}
      >
        OCR Tool
      </h2>
      <div 
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: '0 1.2rem',
          marginBottom: '1.5rem',
        }}
      >
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload}
          style={{
            width: '90%',
            padding: '1rem 1.2rem',
            marginBottom: '0',
            border: '2px solid #d1d5db',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '400',
            color: '#1e293b',
            backgroundColor: '#f8fafc',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxSizing: 'border-box',
            boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.05)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = '#8b5cf6';
            e.currentTarget.style.boxShadow = '0 0 8px rgba(139, 92, 246, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = '#d1d5db';
            e.currentTarget.style.boxShadow = 'inset 0 2px 6px rgba(0, 0, 0, 0.05)';
          }}
        />
      </div>
      <p 
        id="ocr-status"
        style={{
          margin: '1.2rem 0',
          fontSize: '1.1rem',
          color: '#64748b',
          fontStyle: 'italic',
          textAlign: 'center',
          minHeight: '1.4em',
          transition: 'all 0.3s ease',
          opacity: ocrStatus === "Upload an image to extract text." ? 0.7 : 1,
        }}
      >
        {ocrStatus}
      </p>
      <div 
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: '0 1.2rem',
        }}
      >
        <textarea 
          rows="6" 
          placeholder="Extracted text will appear here..." 
          value={ocrText} 
          readOnly
          style={{
            width: '90%',
            padding: '1rem 1.2rem',
            border: '2px solid #d1d5db',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontFamily: "'Courier New', Courier, monospace",
            color: '#1e293b',
            backgroundColor: '#f8fafc',
            resize: 'vertical',
            minHeight: '160px',
            transition: 'all 0.3s ease',
            boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.05)',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#8b5cf6';
            e.currentTarget.style.boxShadow = '0 0 8px 3px rgba(139, 92, 246, 0.35)';
            e.currentTarget.style.backgroundColor = '#fff';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#d1d5db';
            e.currentTarget.style.boxShadow = 'inset 0 2px 6px rgba(0, 0, 0, 0.05)';
            e.currentTarget.style.backgroundColor = '#f8fafc';
          }}
        />
      </div>
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(15px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
