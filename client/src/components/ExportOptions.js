// components/ExportOptions.js
import React, { useState } from 'react';
import { ExportService } from '../services/exportService';
import './ExportOptions.css';

const ExportOptions = ({ 
  text, 
  filename = 'ocr-result', 
  onExportComplete,
  className = '' 
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    title: 'OCR Result',
    fontSize: 12,
    fontFamily: 'Arial',
    includeDate: true
  });

  const handleExport = async (format = exportFormat) => {
    if (!text || text.trim().length === 0) {
      alert('No text content to export');
      return;
    }

    setIsExporting(true);
    
    try {
      const options = {
        title: exportOptions.title,
        fontSize: format === 'docx' ? exportOptions.fontSize * 2 : exportOptions.fontSize, // DOCX uses half-points
        fontFamily: exportOptions.fontFamily,
        includeDate: exportOptions.includeDate
      };

      const result = await ExportService.exportText(text, filename, format, options);
      
      if (result.success) {
        // Show success message
        if (onExportComplete) {
          onExportComplete(result.message, 'success');
        } else {
          alert(result.message);
        }
      } else {
        // Show error message
        if (onExportComplete) {
          onExportComplete(result.message, 'error');
        } else {
          alert(result.message);
        }
      }
    } catch (error) {
      console.error('Export error:', error);
      const errorMessage = 'An unexpected error occurred during export';
      if (onExportComplete) {
        onExportComplete(errorMessage, 'error');
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleQuickExport = (format) => {
    setExportFormat(format);
    handleExport(format);
  };

  const updateOption = (key, value) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getFileSize = () => {
    if (!text) return '0 B';
    const bytes = new Blob([text]).size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={`export-options ${className}`}>
      <div className="export-header">
        <h3>Export Options</h3>
        <div className="export-info">
          <span>Text Length: {text?.length || 0} characters</span>
          <span>File Size: {getFileSize()}</span>
        </div>
      </div>

      {/* Quick Export Buttons */}
      <div className="quick-export-section">
        <h4>Quick Export</h4>
        <div className="quick-export-buttons">
          <button
            onClick={() => handleQuickExport('txt')}
            disabled={isExporting || !text}
            className="export-btn txt-btn"
            title="Export as plain text file"
          >
            <span className="btn-icon">📄</span>
            Export as TXT
          </button>
          
          <button
            onClick={() => handleQuickExport('pdf')}
            disabled={isExporting || !text}
            className="export-btn pdf-btn"
            title="Export as PDF document"
          >
            <span className="btn-icon">📋</span>
            Export as PDF
          </button>
          
          <button
            onClick={() => handleQuickExport('docx')}
            disabled={isExporting || !text}
            className="export-btn docx-btn"
            title="Export as Word document"
          >
            <span className="btn-icon">📝</span>
            Export as DOCX
          </button>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="advanced-section">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="toggle-advanced"
          type="button"
        >
          {showAdvanced ? '▼' : '▶'} Advanced Options
        </button>

        {showAdvanced && (
          <div className="advanced-options">
            <div className="option-group">
              <label>
                Document Title:
                <input
                  type="text"
                  value={exportOptions.title}
                  onChange={(e) => updateOption('title', e.target.value)}
                  placeholder="Enter document title"
                />
              </label>
            </div>

            <div className="option-group">
              <label>
                Font Size:
                <select
                  value={exportOptions.fontSize}
                  onChange={(e) => updateOption('fontSize', parseInt(e.target.value))}
                >
                  <option value={10}>10pt</option>
                  <option value={11}>11pt</option>
                  <option value={12}>12pt (Default)</option>
                  <option value={14}>14pt</option>
                  <option value={16}>16pt</option>
                  <option value={18}>18pt</option>
                </select>
              </label>
            </div>

            <div className="option-group">
              <label>
                Font Family:
                <select
                  value={exportOptions.fontFamily}
                  onChange={(e) => updateOption('fontFamily', e.target.value)}
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Calibri">Calibri</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                </select>
              </label>
            </div>

            <div className="option-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={exportOptions.includeDate}
                  onChange={(e) => updateOption('includeDate', e.target.checked)}
                />
                Include generation date
              </label>
            </div>

            <div className="custom-export">
              <div className="format-selector">
                <label>
                  Export Format:
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                  >
                    <option value="txt">Plain Text (.txt)</option>
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="docx">Word Document (.docx)</option>
                  </select>
                </label>
              </div>

              <button
                onClick={() => handleExport()}
                disabled={isExporting || !text}
                className="custom-export-btn"
              >
                {isExporting ? 'Exporting...' : `Export as ${exportFormat.toUpperCase()}`}
              </button>
            </div>
          </div>
        )}
      </div>

      {isExporting && (
        <div className="export-progress">
          <div className="progress-spinner"></div>
          <span>Preparing your {exportFormat.toUpperCase()} file...</span>
        </div>
      )}
    </div>
  );
};

export default ExportOptions;