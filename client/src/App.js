import { useState } from 'react';
import Login from './components/Login';
import ImageUpload from './components/ImageUpload';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    avatar: "https://via.placeholder.com/150",
  });

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

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <h1 
            className="welcome-text"
            style={{
              fontSize: '3.5rem',
              fontWeight: '800',
              color: '#1e293b',
              letterSpacing: '0.04em',
              textAlign: 'center',
              margin: 0,
              padding: '2rem',
              background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'fadeIn 1.5s ease-in-out',
              textShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            Welcome to Write!
          </h1>
        );
      case 'ocr':
        return <ImageUpload />;
      case 'notes':
      case 'archive':
        return (
          <h2 
            className="placeholder"
            style={{
              fontSize: '2.2rem',
              color: '#0ea5e9',
              fontStyle: 'italic',
              textAlign: 'center',
              marginTop: '3rem',
              background: 'linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'pulse 2.5s infinite',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            Coming Soon...
          </h2>
        );
      case 'profile':
        return (
          <div 
            className="container"
            style={{
              background: 'linear-gradient(145deg, #ffffff, #f1f5f9)',
              padding: '3rem 2.5rem',
              borderRadius: '20px',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
              maxWidth: '450px',
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
              Profile Settings
            </h2>
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <div 
                style={{
                  marginBottom: '1.5rem',
                  textAlign: 'center',
                }}
              >
                <img
                  src={userProfile.avatar}
                  alt="Profile Avatar"
                  style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '4px solid #8b5cf6',
                    boxShadow: '0 6px 12px rgba(139, 92, 246, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div 
                  style={{
                    marginTop: '1rem',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{
                      padding: '1rem 1.2rem',
                      border: '2px solid #d1d5db',
                      borderRadius: '12px',
                      fontSize: '1.1rem',
                      fontWeight: '400',
                      color: '#1e293b',
                      backgroundColor: '#f8fafc',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.05)',
                      width: '100%',
                      maxWidth: '100%',
                      boxSizing: 'border-box',
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
              </div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={userProfile.name}
                onChange={handleProfileChange}
                style={{
                  padding: '1rem 1.2rem',
                  marginBottom: '1.5rem',
                  border: '2px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '400',
                  color: '#1e293b',
                  backgroundColor: '#f8fafc',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  width: '100%',
                  boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.05)',
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
                type="email"
                name="email"
                placeholder="Email"
                value={userProfile.email}
                onChange={handleProfileChange}
                disabled
                style={{
                  padding: '1rem 1.2rem',
                  marginBottom: '1.5rem',
                  border: '2px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '400',
                  color: '#64748b',
                  backgroundColor: '#f8fafc',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  width: '100%',
                  boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.05)',
                  opacity: 0.7,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'inset 0 2px 6px rgba(0, 0, 0, 0.05)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'inset 0 2px 6px rgba(0, 0, 0, 0.05)';
                }}
              />
              <button 
                type="button" 
                onClick={handleSaveChanges}
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
                Save Changes
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
                id="logout-btn" 
                onClick={() => setLoggedIn(false)}
                style={{
                  background: 'linear-gradient(90deg, #f87171, #ef4444)',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '0.7rem 1.4rem',
                  fontWeight: '700',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: '0 4px 10px rgba(239, 68, 68, 0.5)',
                  transition: 'all 0.3s ease',
                  marginTop: '1rem',
                  width: '100%',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #ef4444, #b91c1c)';
                  e.currentTarget.style.boxShadow = '0 6px 14px rgba(185, 28, 28, 0.6)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #f87171, #ef4444)';
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(239, 68, 68, 0.5)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Logout
              </button>
            </div>
          );
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
          padding: '1.8rem 2.5rem',
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
        }}
      >
        <div 
          className="logo"
          style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            background: 'linear-gradient(45deg, #fff, #d1fae5, #e0f2fe)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'fadeIn 1s ease-in-out',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          WoS
        </div>
        <nav 
          className="nav-links"
          style={{
            display: 'flex',
            gap: '2rem',
            marginRight: 0,
          }}
        >
          {['home', 'notes', 'ocr', 'archive', 'profile'].map((page) => (
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
              {page === 'ocr' ? 'OCR' : page.charAt(0).toUpperCase() + page.slice(1)}
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
        `}
      </style>
    </div>
  );
}
