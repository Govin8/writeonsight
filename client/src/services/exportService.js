import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export class ExportService {
  
  /**
   * Export text as TXT file
   */
  static exportAsTXT(text, filename = 'ocr-result') {
    try {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, `${filename}.txt`);
      return { success: true, message: 'TXT file exported successfully!' };
    } catch (error) {
      console.error('Error exporting TXT:', error);
      return { success: false, message: 'Failed to export TXT file' };
    }
  }

  /**
   * Export text as PDF file
   */
  static exportAsPDF(text, filename = 'ocr-result', options = {}) {
    try {
      const {
        title = 'OCR Result',
        fontSize = 12,
        lineHeight = 1.5,
        margin = 20,
        maxWidth = 170 // mm, for A4 page width minus margins
      } = options;

      const doc = new jsPDF();
      
      // Set font
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(fontSize);

      // Add title
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(title, margin, margin);
      
      // Add date
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, margin + 10);

      // Reset font for content
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'normal');

      // Split text into lines that fit the page width
      const textLines = doc.splitTextToSize(text, maxWidth);
      
      let yPosition = margin + 25; // Start below title and date
      const pageHeight = doc.internal.pageSize.height;
      const lineHeightMM = fontSize * lineHeight * 0.352778; // Convert points to mm

      textLines.forEach((line) => {
        // Check if we need a new page
        if (yPosition + lineHeightMM > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        
        doc.text(line, margin, yPosition);
        yPosition += lineHeightMM;
      });

      // Add page numbers
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `Page ${i} of ${totalPages}`,
          doc.internal.pageSize.width - 40,
          doc.internal.pageSize.height - 10
        );
      }

      // Save the PDF
      doc.save(`${filename}.pdf`);
      
      return { success: true, message: 'PDF exported successfully!' };
    } catch (error) {
      console.error('Error exporting PDF:', error);
      return { success: false, message: 'Failed to export PDF file' };
    }
  }

  /**
   * Export text as Word DOC file (DOCX format)
   */
  static async exportAsDOCX(text, filename = 'ocr-result', options = {}) {
    try {
      const {
        title = 'OCR Result',
        fontSize = 24, // Half-points (12pt = 24 half-points)
        fontFamily = 'Arial'
      } = options;

      // Split text into paragraphs
      const paragraphs = text.split(/\n\s*\n/).filter(para => para.trim().length > 0);
      
      // Create document sections
      const docSections = [
        // Title
        new Paragraph({
          heading: HeadingLevel.TITLE,
          children: [
            new TextRun({
              text: title,
              bold: true,
              size: 32, // 16pt
              font: fontFamily
            })
          ]
        }),
        
        // Date
        new Paragraph({
          children: [
            new TextRun({
              text: `Generated on: ${new Date().toLocaleDateString()}`,
              italics: true,
              size: 20, // 10pt
              font: fontFamily
            })
          ],
          spacing: { after: 400 } // Add space after date
        }),

        // Content paragraphs
        ...paragraphs.map(paragraph => 
          new Paragraph({
            children: [
              new TextRun({
                text: paragraph.trim(),
                size: fontSize,
                font: fontFamily
              })
            ],
            spacing: { after: 200 } // Space between paragraphs
          })
        )
      ];

      // Create the document
      const doc = new Document({
        sections: [{
          properties: {},
          children: docSections
        }],
        styles: {
          default: {
            document: {
              run: {
                font: fontFamily,
                size: fontSize
              },
              paragraph: {
                spacing: { line: 360 } // 1.5 line spacing
              }
            }
          }
        }
      });

      // Generate and save the document
      const buffer = await Packer.toBlob(doc);
      saveAs(buffer, `${filename}.docx`);
      
      return { success: true, message: 'Word document exported successfully!' };
    } catch (error) {
      console.error('Error exporting DOCX:', error);
      return { success: false, message: 'Failed to export Word document' };
    }
  }

  /**
   * Get formatted filename from original image filename
   */
  static getFormattedFilename(originalFilename) {
    if (!originalFilename) return 'ocr-result';
    
    // Remove file extension and sanitize
    const nameWithoutExt = originalFilename.replace(/\.[^/.]+$/, '');
    const sanitized = nameWithoutExt
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    return sanitized || 'ocr-result';
  }

  /**
   * Validate text content before export
   */
  static validateExportData(text, filename) {
    const errors = [];
    
    if (!text || text.trim().length === 0) {
      errors.push('No text content to export');
    }
    
    if (text && text.length > 100000) {
      errors.push('Text content is too large (max 100,000 characters)');
    }
    
    if (filename && filename.length > 100) {
      errors.push('Filename is too long (max 100 characters)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Export with automatic format detection or user choice
   */
  static async exportText(text, filename, format, options = {}) {
    // Validate input
    const validation = this.validateExportData(text, filename);
    if (!validation.isValid) {
      return { 
        success: false, 
        message: `Export failed: ${validation.errors.join(', ')}` 
      };
    }

    // Clean filename
    const cleanFilename = this.getFormattedFilename(filename);
    
    // Export based on format
    switch (format.toLowerCase()) {
      case 'txt':
        return this.exportAsTXT(text, cleanFilename);
      
      case 'pdf':
        return this.exportAsPDF(text, cleanFilename, options);
      
      case 'docx':
      case 'doc':
        return await this.exportAsDOCX(text, cleanFilename, options);
      
      default:
        return { 
          success: false, 
          message: `Unsupported format: ${format}. Use 'txt', 'pdf', or 'docx'` 
        };
    }
  }
}