import { useState, useEffect } from 'react';
import Login from './components/Login';
import Home from './Home';
import WritingDashboard from './WritingDashboard';
import OCR from './OCR';
import Archive from './Archive';
import Profile from './Profile';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    avatar: "https://via.placeholder.com/150",
  });
  const [drafts, setDrafts] = useState([]);
  const [currentDraft, setCurrentDraft] = useState({ id: null, title: '', content: '', tags: [], isArchived: false });
  const [isEditing, setIsEditing] = useState(false);

  const handleLoginSuccess = ({ name, email }) => {
    setUserProfile({ name, email, avatar: "https://via.placeholder.com/150" });
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfile((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    alert("Profile updated successfully!");
  };

  const createDraft = () => {
    const newDraft = { id: Date.now(), title: 'Untitled Draft', content: '', tags: [], isArchived: false };
    setDrafts([...drafts, newDraft]);
    setCurrentDraft(newDraft);
    setIsEditing(true);
  };

  const saveDraft = () => {
    if (currentDraft.id) {
      setDrafts(drafts.map(d => d.id === currentDraft.id ? currentDraft : d));
    } else {
      const newDraft = { ...currentDraft, id: Date.now() };
      setDrafts([...drafts, newDraft]);
      setCurrentDraft(newDraft);
    }
    setIsEditing(false);
    alert("Draft saved successfully!");
  };

  const editDraft = (draft) => {
    setCurrentDraft(draft);
    setIsEditing(true);
  };

  const addTag = (tag) => {
    if (!currentDraft.tags.includes(tag) && tag.trim()) {
      setCurrentDraft({ ...currentDraft, tags: [...currentDraft.tags, tag.trim()] });
    }
  };

  const deleteDraft = (id) => {
    if (window.confirm("Are you sure you want to delete this draft?")) {
      setDrafts(drafts.filter(d => d.id !== id));
      if (currentDraft.id === id) {
        setCurrentDraft({ id: null, title: '', content: '', tags: [], isArchived: false });
        setIsEditing(false);
      }
      alert("Draft deleted successfully!");
    }
  };

  const archiveDraft = (id) => {
    setDrafts(drafts.map(d => d.id === id ? { ...d, isArchived: true } : d));
  };

  const unarchiveDraft = (id) => {
    setDrafts(drafts.map(d => d.id === id ? { ...d, isArchived: false } : d));
  };

  const exportDraft = (id, format) => {
    const draft = drafts.find(d => d.id === id);
    if (draft) {
      const blob = new Blob([draft.content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${draft.title}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      alert(`Draft exported as ${format} successfully!`);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'ocr':
        return <OCR currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'writingDashboard':
        return <WritingDashboard drafts={drafts} currentDraft={currentDraft} setDrafts={setDrafts} setCurrentDraft={setCurrentDraft} isEditing={isEditing} setIsEditing={setIsEditing} createDraft={createDraft} saveDraft={saveDraft} editDraft={editDraft} addTag={addTag} deleteDraft={deleteDraft} archiveDraft={archiveDraft} exportDraft={exportDraft} />;
      case 'archive':
        return <Archive drafts={drafts} currentDraft={currentDraft} setDrafts={setDrafts} setCurrentDraft={setCurrentDraft} isEditing={isEditing} setIsEditing={setIsEditing} editDraft={editDraft} unarchiveDraft={unarchiveDraft} deleteDraft={deleteDraft} />;
      case 'profile':
        return <Profile userProfile={userProfile} setUserProfile={setUserProfile} handleProfileChange={handleProfileChange} handleAvatarChange={handleAvatarChange} handleSaveChanges={handleSaveChanges} setLoggedIn={setLoggedIn} />;
      default:
        return null;
    }
  };

  if (!loggedIn) return <Login setLoggedIn={setLoggedIn} onLoginSuccess={handleLoginSuccess} />;

  return (
    <div 
      className="app-container"
      style={{
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        background: 'linear-gradient(135deg, #e0f2fe, #dbeafe, #f3e8ff)',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        overflowX: 'hidden',
      }}
    >
      <header 
        className="app-header"
        style={{
          width: '100%',
          background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6)',
          padding: '0.5rem 2.5rem',
          color: 'white',
          boxSizing: 'border-box',
          margin: 0,
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(5px)',
          height: '80px',
        }}
      >
        <div 
          className="logo"
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            animation: 'fadeIn 1s ease-in-out',
            transition: 'transform 0.3s ease',
            borderRadius: '14px',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <img 
            src="https://i.postimg.cc/jCLNDXkp/Whats-App-Image-2025-06-01-at-14-13-20.jpg"
            alt="Write On Sight Logo"
            style={{
              height: '70px',
              width: 'auto',
              display: 'block',
            }}
          />
        </div>
        <nav 
          className="nav-links"
          style={{
            display: 'flex',
            gap: '2rem',
            marginRight: 0,
          }}
        >
          {['home', 'writingDashboard', 'ocr', 'archive', 'profile'].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: '2px solid rgba(255, 255, 255, 0.9)',
                color: 'white',
                padding: '0.8rem 1.6rem',
                cursor: 'pointer',
                borderRadius: '14px',
                fontSize: '1.2rem',
                fontWeight: '700',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
                opacity: currentPage === page ? 1 : 0.7,
                textTransform: page === 'ocr' ? 'uppercase' : 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.boxShadow = '0 6px 14px rgba(0, 0, 0, 0.25)';
                e.currentTarget.style.borderColor = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.9)';
              }}
            >
              <span 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                  transition: '0.5s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.left = '100%'}
              />
              {page === 'writingDashboard' ? 'Writing Dashboard' : page === 'ocr' ? 'OCR' : page.charAt(0).toUpperCase() + page.slice(1)}
            </button>
          ))}
        </nav>
      </header>
      <main 
        className="main-content"
        style={{
          flex: 1,
          padding: '4rem 2.5rem',
          background: 'linear-gradient(180deg, #e0f2fe, #f3e8ff, #f8fafc)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          minHeight: 'calc(100vh - 90px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.1), transparent 70%)',
            zIndex: -1,
          }}
        />
        {renderPage()}
      </main>
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.02); }
            100% { opacity: 0.7; transform: scale(1); }
          }
          .action-buttons, .draft-actions, .export-options {
            display: flex;
            gap: 1rem;
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
          }
          .tags {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
          }
        `}
      </style>
    </div>
  );
}
