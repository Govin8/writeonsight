import { useState, useEffect } from 'react';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

export default function Archive({ drafts, currentDraft, setDrafts, setCurrentDraft, isEditing, setIsEditing, editDraft, unarchiveDraft, deleteDraft }) {
  const [tags, setTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('All');

  useEffect(() => {
    setTags(currentDraft.tags || []);
  }, [currentDraft.tags]);

  const handleTagToggle = (tag) => {
    setTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
    setCurrentDraft({ ...currentDraft, tags: tags.includes(tag) ? currentDraft.tags.filter(t => t !== tag) : [...currentDraft.tags, tag] });
  };

  const allTags = ['All', ...new Set(['Academic', 'Personal', 'Work', ...drafts.flatMap(d => d.tags)])];

  const filteredDrafts = drafts
    .filter(d => d.isArchived)
    .filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.content.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(d => filterTag === 'All' || d.tags.includes(filterTag));

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
      alert('Error unarchiving draft. Please try again.');
    }
  };

  const handleDeleteDraft = async (draftId) => {
    try {
      if (!auth.currentUser) {
        throw new Error('No authenticated user found.');
      }

      const draftRef = doc(db, 'users', auth.currentUser.uid, 'drafts', draftId);
      await deleteDoc(draftRef);
      console.log('Draft deleted from Firestore with ID:', draftId);
      setDrafts(prevDrafts => prevDrafts.filter(d => d.id !== draftId));
      if (currentDraft.id === draftId) {
        setCurrentDraft(null); 
        setIsEditing(false);
      }

      if (deleteDraft) {
        deleteDraft(draftId);
      }
    } catch (error) {
      console.error('Error deleting draft:', error);
      alert('Error deleting draft. Please try again.');
    }
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
        Archive
      </h2>
      <div style={{ marginBottom: '1.5rem', width: '100%', display: 'flex', gap: '1rem' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search drafts..."
          style={{
            padding: '0.8rem',
            border: '2px solid #d1d5db',
            borderRadius: '12px',
            fontSize: '1rem',
            width: '70%',
            boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.05)',
          }}
        />
        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          style={{
            padding: '0.8rem',
            border: '2px solid #d1d5db',
            borderRadius: '12px',
            fontSize: '1rem',
            width: '30%',
            boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.05)',
          }}
        >
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>
      {filteredDrafts.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#64748b' }}>No archived drafts available.</p>
      ) : (
        filteredDrafts.map(draft => (
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
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>{draft.title}</h3>
            <p style={{ margin: '0 0 0.5rem 0', color: '#64748b' }}>{draft.content.substring(0, 100) || 'No content yet'}...</p>
            <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.8rem' }}>
              Last edited: {new Date(draft.lastEdited).toLocaleString()}
            </p>
            <div className="tags" style={{ marginBottom: '1rem' }}>
              {draft.tags.map(tag => (
                <span
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  style={{
                    display: 'inline-block',
                    padding: '0.3rem 0.8rem',
                    margin: '0.2rem',
                    background: tags.includes(tag) ? '#bfdbfe' : '#dbeafe',
                    borderRadius: '8px',
                    color: '#1e293b',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="draft-actions">
              <button 
                onClick={() => handleUnarchiveDraft(draft.id)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  boxShadow: '0 4px 8px rgba(34, 197, 94, 0.3)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #16a34a, #065f46)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(6, 95, 70, 0.5)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #22c55e, #16a34a)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(34, 197, 94, 0.3)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Unarchive
              </button>
              <button 
                onClick={() => handleDeleteDraft(draft.id)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'linear-gradient(90deg, #f87171, #ef4444)',
                  color: 'white',
                  borderRadius: '12px',
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
          </div>
        ))
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
