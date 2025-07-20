import { useState } from 'react';
import Tesseract from 'tesseract.js';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

export default function OCR({ currentPage, setCurrentPage }) {
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

  const exportAsTxt = () => {
    if (!ocrText.trim()) {
      alert('No text to export. Please extract text from an image first.');
      return;
    }
    
    const blob = new Blob([ocrText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted-text-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportAsPdf = async () => {
    if (!ocrText.trim()) {
      alert('No text to export. Please extract text from an image first.');
      return;
    }

    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxLineWidth = pageWidth - 2 * margin;
      const lineHeight = 10;
      
      const lines = doc.splitTextToSize(ocrText, maxLineWidth);
      
      let y = margin;
      lines.forEach((line) => {
        if (y > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });
      
      doc.save(`extracted-text-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error exporting PDF. Please try again.');
    }
  };

  const exportAsDocx = async () => {
    if (!ocrText.trim()) {
      alert('No text to export. Please extract text from an image first.');
      return;
    }

    try {
      setOcrStatus("Preparing DOCX export...");

      const paragraphs = ocrText
        .split('\n')
        .map((line) =>
          new Paragraph({
            children: [new TextRun(line)],
          })
        );

      const doc = new Document({
        sections: [
          {
            children: paragraphs,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `extracted-text-${Date.now()}.docx`);

      setOcrStatus("Document export complete!");
      setTimeout(() => {
        setOcrStatus("Upload an image to extract text.");
      }, 3000);
    } catch (error) {
      console.error('Error exporting DOCX:', error);
      setOcrStatus("Failed to export document.");
      alert(`Error exporting document: ${error.message}`);
    }
  };

  const buttonStyle = {
    padding: '0.8rem 1.5rem',
    margin: '0 0.5rem',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    color: 'white',
    minWidth: '80px',
  };

  return (
    <div 
      className="container ocr-container"
      style={{
        background: 'linear-gradient(145deg, #ffffff, #f1f5f9)',
        padding: '3rem 2.5rem',
        borderRadius: '20px',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
        maxWidth: '500px',
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
        minHeight: '600px',
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
          marginBottom: '1.5rem',
        }}
      >
        <textarea 
          rows="6" 
          placeholder="Extracted text will appear here..." 
          value={ocrText} 
          onChange={(e) => setOcrText(e.target.value)}
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

      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.5rem',
        marginTop: '1rem',
      }}>
        <button
          onClick={exportAsTxt}
          style={{
            ...buttonStyle,
            background: 'linear-gradient(135deg, #10b981, #059669)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }}
        >
          📄 TXT
        </button>
        
        <button
          onClick={exportAsPdf}
          style={{
            ...buttonStyle,
            background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(220, 38, 38, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }}
        >
          📕 PDF
        </button>
        
        <button
          onClick={exportAsDocx}
          style={{
            ...buttonStyle,
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }}
        >
          📘 DOCX
        </button>
        
        <button
          onClick={resetOcr}
          style={{
            ...buttonStyle,
            background: 'linear-gradient(135deg, #6b7280, #4b5563)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(107, 114, 128, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }}
        >
          🔄 Reset
        </button>
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
