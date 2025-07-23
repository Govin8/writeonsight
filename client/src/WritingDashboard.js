import { useState, useEffect } from 'react';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { doc, setDoc, collection, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { v4 as uuidv4 } from 'uuid';

export default function WritingDashboard({
  drafts,
  currentDraft,
  setDrafts,
  setCurrentDraft,
  isEditing,
  setIsEditing,
  createDraft,
  saveDraft,
  editDraft,
  addTag,
  deleteDraft,
  archiveDraft,
  exportDraft,
  unarchiveDraft,
}) {
  const [tags, setTags] = useState(currentDraft.tags || []);
  const [newTag, setNewTag] = useState('');
  const [isArchiving, setIsArchiving] = useState(false);
  const [archiveError, setArchiveError] = useState(null);

  useEffect(() => {
    setTags(currentDraft.tags || []);
    fetchArchivedDrafts();
  }, [currentDraft.tags]);

  const fetchArchivedDrafts = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const q = query(collection(db, 'users', user.uid, 'drafts'), where('isArchived', '==', true));
      const querySnapshot = await getDocs(q);
      const archivedDrafts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDrafts(prevDrafts => [...prevDrafts.filter(d => !d.isArchived), ...archivedDrafts]);
    } catch (error) {
      console.error('Error fetching archived drafts:', error);
    }
  };

  const handleTagToggle = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setCurrentDraft({
      ...currentDraft,
      tags: tags.includes(tag)
        ? currentDraft.tags.filter((t) => t !== tag)
        : [...currentDraft.tags, tag],
    });
  };

  const handleAddNewTag = (e) => {
    if (e.key === 'Enter' && newTag.trim() && !tags.includes(newTag.trim())) {
      addTag(newTag.trim());
      setNewTag('');
    }
  };

 const handleSaveDraft = () => {
  const user = auth.currentUser;
  if (!user) {
    console.error('User is not signed in.');
    return;
  }

  const newDocRef = doc(collection(db, 'temp'));
  const generatedId = newDocRef.id;

  const updatedDraft = {
    ...currentDraft,
    tags,
    title: currentDraft.title || 'Untitled Draft',
    content: currentDraft.content || '',
    lastEdited: new Date().toISOString(),
    id: currentDraft.id || generatedId,
    isArchived: false,
  };

  saveDraft(updatedDraft);
  setCurrentDraft(updatedDraft);
  setDrafts(drafts.map(d => d.id === updatedDraft.id ? updatedDraft : d));

  const draftRef = doc(db, 'users', user.uid.toString(), 'drafts', updatedDraft.id.toString());
  setDoc(draftRef, updatedDraft, { merge: true })
    .then(() => console.log('Draft saved to Firestore with ID:', updatedDraft.id))
    .catch(error => console.error('Error saving draft to Firestore:', error));
};

  const saveDraftToFirestore = async (draft, newId = null) => {
    const user = auth.currentUser;
    if (!user) {
      setArchiveError('You must be signed in to archive this draft.');
      setIsArchiving(false);
      return;
    }

    const draftId = newId || draft.id;
    if (!draftId) {
      setArchiveError('Draft must have a valid ID before saving.');
      setIsArchiving(false);
      return;
    }

    const draftToSave = {
      ...draft,
      id: draftId,
      isArchived: true,
      lastEdited: new Date().toISOString(),
    };

    try {
      const draftRef = doc(db, 'users', user.uid, 'drafts', draftId);
      await setDoc(draftRef, draftToSave, { merge: true });
      console.log('Draft archived to Firestore successfully with ID:', draftId);
      setArchiveError(null);
    } catch (error) {
      console.error('Error saving to Firestore:', error);
      setArchiveError(
        error.code === 'permission-denied'
          ? 'You do not have permission to archive this draft. Check Firestore rules.'
          : error.message.includes('deadline-exceeded')
          ? 'Network timeout. Please check your internet connection.'
          : 'Failed to archive draft to cloud.'
      );
    } finally {
      setIsArchiving(false);
    }
  };

  const handleArchiveDraft = async (draftId) => {
    setIsArchiving(true);
    setArchiveError(null);
    try {
      const draftToArchive = drafts.find((d) => d.id === draftId);
      if (!draftToArchive) {
        throw new Error('Draft not found.');
      }

      const newDraftId = (draftToArchive.id && typeof draftToArchive.id === 'string') ? draftToArchive.id : uuidv4();
      const updatedDraft = { ...draftToArchive, id: newDraftId };
      await archiveDraft(draftId);
      await saveDraftToFirestore(updatedDraft, newDraftId);

      setDrafts(
        drafts.map((d) =>
          d.id === draftId ? { ...d, id: newDraftId, isArchived: true } : d
        )
      );
      setCurrentDraft(updatedDraft);
    } catch (error) {
      console.error('Error archiving draft:', error);
      setArchiveError('An error occurred while archiving the draft.');
      setIsArchiving(false);
    }
  };

  const handleUnarchiveDraft = async (draftId) => {
    try {
      const draftToUnarchive = drafts.find((d) => d.id === draftId);
      if (!draftToUnarchive) {
        throw new Error('Draft not found.');
      }

      const updatedDraft = { ...draftToUnarchive, isArchived: false, lastEdited: new Date().toISOString() };
      const draftRef = doc(db, 'users', auth.currentUser.uid, 'drafts', draftId);
      await setDoc(draftRef, updatedDraft, { merge: true });
      console.log('Draft unarchived in Firestore with ID:', draftId);

      await deleteDoc(draftRef);
      console.log('Archived draft deleted from Firestore with ID:', draftId);

      unarchiveDraft(draftId);
      setDrafts(prevDrafts => [...prevDrafts.filter(d => d.id !== draftId), updatedDraft]); 
      setCurrentDraft(updatedDraft);
      setIsEditing(true); 
    } catch (error) {
      console.error('Error unarchiving draft:', error);
      setArchiveError('An error occurred while unarchiving the draft.');
    }
  };

  const exportAsPdf = async () => {
    if (!currentDraft.content.trim()) {
      alert('No text to export. Please add content to the draft first.');
      return;
    }

    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxLineWidth = pageWidth - 2 * margin;
      const lineHeight = 10;
      
      const lines = doc.splitTextToSize(currentDraft.content, maxLineWidth);
      
      let y = margin;
      lines.forEach((line) => {
        if (y > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });
      
      const sanitizedTitle = currentDraft.title.replace(/[^a-zA-Z0-9-_]/g, '_');
      doc.save(`${sanitizedTitle}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error exporting PDF. Please try again.');
    }
  };

  const exportAsDocx = async () => {
    if (!currentDraft.content.trim()) {
      alert('No text to export. Please add content to the draft first.');
      return;
    }

    try {
      const paragraphs = currentDraft.content
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
      const sanitizedTitle = currentDraft.title.replace(/[^a-zA-Z0-9-_]/g, '_');
      saveAs(blob, `${sanitizedTitle}.docx`);
    } catch (error) {
      console.error('Error exporting DOCX:', error);
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
      className="writing-dashboard"
      style={{
        background: 'linear-gradient(145deg, #ffffff, #f1f5f9)',
        padding: '3rem 2.5rem',
        borderRadius: '20px',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
        maxWidth: '800px',
        width: '90%',
        margin: '0 auto 3rem',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
        Writing Dashboard
      </h2>
      <div className="action-buttons" style={{ marginBottom: '2.5rem' }}>
        <button 
          onClick={() => createDraft({ title: 'Untitled Draft', content: '', lastEdited: new Date().toISOString(), tags: [], id: doc(collection(db, 'temp')).id })}
          style={{
            padding: '1rem',
            background: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
            color: 'white',
            borderRadius: '12px',
            fontSize: '1.2rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            border: 'none',
            boxShadow: '0 6px 12px rgba(59, 130, 246, 0.35)',
            width: '100%',
            maxWidth: '200px',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'linear-gradient(90deg, #0891b2, #2563eb)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(37, 99, 235, 0.5)';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'linear-gradient(90deg, #06b6d4, #3b82f6)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(59, 130, 246, 0.35)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          New Draft
          <span 
            style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
              transition: '0.5s',
            }}
            onMouseOver={(e) => e.currentTarget.style.left = '100%'}
          />
        </button>
        <button 
          onClick={() => setIsEditing(false)}
          style={{
            padding: '1rem',
            background: 'linear-gradient(90deg, #f87171, #ef4444)',
            color: 'white',
            borderRadius: '12px',
            fontSize: '1.2rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            border: 'none',
            boxShadow: '0 6px 12px rgba(239, 68, 68, 0.35)',
            width: '100%',
            maxWidth: '200px',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'linear-gradient(90deg, #ef4444, #b91c1c)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(185, 28, 28, 0.5)';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'linear-gradient(90deg, #f87171, #ef4444)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(239, 68, 68, 0.35)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Cancel Edit
          <span 
            style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
              transition: '0.5s',
            }}
            onMouseOver={(e) => e.currentTarget.style.left = '100%'}
          />
        </button>
      </div>
      {isEditing ? (
        <div className="draft-editor" style={{ width: '100%', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="text"
            value={currentDraft.title || ''}
            onChange={(e) => setCurrentDraft({ ...currentDraft, title: e.target.value })}
            placeholder="Draft Title"
            style={{
              padding: '1rem 1.2rem',
              marginBottom: '1rem',
              border: '2px solid #d1d5db',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '400',
              color: '#1e293b',
              backgroundColor: '#f8fafc',
              transition: 'all 0.3s ease',
              outline: 'none',
              width: '80%',
              maxWidth: 600,
              boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.05)',
              textAlign: 'left',
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
          <textarea
            value={currentDraft.content || ''}
            onChange={(e) => setCurrentDraft({ ...currentDraft, content: e.target.value })}
            placeholder="Start writing..."
            style={{
              padding: '1rem 1.2rem',
              marginBottom: '1rem',
              border: '2px solid #d1d5db',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '400',
              color: '#1e293b',
              backgroundColor: '#f8fafc',
              transition: 'all 0.3s ease',
              outline: 'none',
              width: '80%',
              maxWidth: 600,
              minHeight: '300px',
              boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.05)',
              textAlign: 'left',
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
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleAddNewTag}
            placeholder="Add tag and press Enter"
            className="tag-input"
            style={{
              padding: '1rem 1.2rem',
              marginBottom: '1rem',
              border: '2px solid #d1d5db',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '400',
              color: '#1e293b',
              backgroundColor: '#f8fafc',
              transition: 'all 0.3s ease',
              outline: 'none',
              width: '80%',
              maxWidth: 600,
              boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.05)',
              textAlign: 'left',
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
          <div className="tags" style={{ marginBottom: '1rem' }}>
            {['Academic', 'Personal', 'Work'].map(tag => (
              <span
                key={tag}
                onClick={() => handleTagToggle(tag)}
                style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  margin: '0.2rem',
                  background: tags.includes(tag) ? '#bfdbfe' : '#e0f2fe',
                  borderRadius: '12px',
                  color: '#1e293b',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                {tag}
              </span>
            ))}
            {currentDraft.tags.filter(tag => !['Academic', 'Personal', 'Work'].includes(tag)).map(tag => (
              <span key={tag} style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                margin: '0.2rem',
                background: '#e0f2fe',
                borderRadius: '12px',
                color: '#1e293b',
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
              onClick={() => setCurrentDraft({ ...currentDraft, tags: currentDraft.tags.filter(t => t !== tag) })}
              >
                {tag} ×
              </span>
            ))}
          </div>
          <div className="draft-actions">
            <button 
              onClick={handleSaveDraft}
              style={{
                padding: '1rem',
                background: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                color: 'white',
                borderRadius: '12px',
                fontSize: '1.2rem',
                fontWeight: '700',
                cursor: 'pointer',
                marginBottom: '1.2rem',
                transition: 'all 0.3s ease',
                border: 'none',
                boxShadow: '0 6px 12px rgba(59, 130, 246, 0.35)',
                width: '100%',
                maxWidth: '200px',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #0891b2, #2563eb)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(37, 99, 235, 0.5)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #06b6d4, #3b82f6)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(59, 130, 246, 0.35)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Save Draft
              <span 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                  transition: '0.5s',
                }}
                onMouseOver={(e) => e.currentTarget.style.left = '100%'}
              />
            </button>
            <button 
              onClick={() => deleteDraft(currentDraft.id)}
              style={{
                padding: '1rem',
                background: 'linear-gradient(90deg, #f87171, #ef4444)',
                color: 'white',
                borderRadius: '12px',
                fontSize: '1.2rem',
                fontWeight: '700',
                cursor: 'pointer',
                marginBottom: '1.2rem',
                transition: 'all 0.3s ease',
                border: 'none',
                boxShadow: '0 6px 12px rgba(239, 68, 68, 0.35)',
                width: '100%',
                maxWidth: '200px',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #ef4444, #b91c1c)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(185, 28, 28, 0.5)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #f87171, #ef4444)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(239, 68, 68, 0.35)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Delete Draft
              <span 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                  transition: '0.5s',
                }}
                onMouseOver={(e) => e.currentTarget.style.left = '100%'}
              />
            </button>
          </div>
          <div className="export-options" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
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
          </div>
        </div>
      ) : (
        <div className="draft-list" style={{ width: '100%' }}>
          {drafts.filter(d => !d.isArchived).length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b' }}>No drafts available. Create a new one!</p>
          ) : (
            drafts.filter(d => !d.isArchived).map(draft => (
              <div key={draft.id} style={{
                padding: '1rem',
                marginBottom: '1rem',
                background: '#e0f2fe',
                borderRadius: '12px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>{draft.title || 'Untitled Draft'}</h3>
                <p style={{ margin: '0 0 0.5rem 0', color: '#64748b' }}>{draft.content.substring(0, 100) || 'No content yet'}...</p>
                <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.8rem' }}>
                  Last edited: {draft.lastEdited ? new Date(draft.lastEdited).toLocaleString() : 'Never'}
                </p>
                <div className="tags">
                  {draft.tags.map(tag => (
                    <span key={tag} style={{
                      display: 'inline-block',
                      padding: '0.3rem 0.8rem',
                      margin: '0.2rem',
                      background: '#dbeafe',
                      borderRadius: '8px',
                      color: '#1e293b',
                      fontSize: '0.8rem',
                    }}>{tag}</span>
                  ))}
                </div>
                <div className="draft-actions">
                  <button 
                    onClick={() => editDraft(draft)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                      color: 'white',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      marginRight: '0.5rem',
                      transition: 'all 0.3s ease',
                      border: 'none',
                      boxShadow: '0 4px 8px rgba(59, 130, 246, 0.3)',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(90deg, #0891b2, #2563eb)';
                      e.currentTarget.style.boxShadow = '0 6px 12px rgba(37, 99, 235, 0.5)';
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(90deg, #06b6d4, #3b82f6)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(59, 130, 246, 0.3)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleArchiveDraft(draft.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: isArchiving ? '#d1d5db' : 'linear-gradient(90deg, #10b981, #065f46)',
                      color: isArchiving ? '#64748b' : 'white',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      cursor: isArchiving ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      border: 'none',
                      boxShadow: isArchiving ? 'none' : '0 4px 8px rgba(16, 185, 129, 0.3)',
                    }}
                    disabled={isArchiving}
                    onMouseOver={(e) => {
                      if (!isArchiving) {
                        e.currentTarget.style.background = 'linear-gradient(90deg, #059669, #047857)';
                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(6, 95, 70, 0.5)';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isArchiving) {
                        e.currentTarget.style.background = 'linear-gradient(90deg, #10b981, #065f46)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(16, 185, 129, 0.3)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    {isArchiving ? 'Archiving...' : 'Archive'}
                  </button>
                  <button 
                    onClick={() => deleteDraft(draft.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'linear-gradient(90deg, #f87171, #ef4444)',
                      color: 'white',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: 'none',
                      boxShadow: '0 4px 8px rgba(239, 68, 68, 0.3)',
                      marginLeft: '0.5rem',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(90deg, #ef4444, #b91c1c)';
                      e.currentTarget.style.boxShadow = '0 6px 12px rgba(185, 28, 28, 0.5)';
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(90deg, #f87171, #ef4444)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.3)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    Delete
                  </button>
                </div>
                {archiveError && (
                  <p style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center', marginTop: '0.5rem' }}>
                    {archiveError}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(15px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .action-buttons {
            display: flex;
            justify-content: center;
            gap: 1rem;
            width: 100%;
          }
          .draft-actions {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            flex-wrap: wrap;
          }
        `}
      </style>
    </div>
  );
}
