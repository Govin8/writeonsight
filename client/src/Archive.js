import { useState, useEffect } from 'react';

export default function Archive({ drafts, currentDraft, setDrafts, setCurrentDraft, isEditing, setIsEditing, editDraft, unarchiveDraft, deleteDraft }) {
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
      {drafts.filter(d => d.isArchived).length === 0 ? (
        <p style={{ textAlign: 'center', color: '#64748b' }}>No archived drafts available.</p>
      ) : (
        drafts.filter(d => d.isArchived).map(draft => (
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
                onClick={() => unarchiveDraft(draft.id)}
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
          </div>
        ))
      )}
    </div>
  );
}