import { useState, useEffect } from 'react';

export default function Profile({ userProfile, setUserProfile, handleProfileChange, handleAvatarChange, handleSaveChanges, setLoggedIn }) {
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
            padding: '1rem',
            fontWeight: '700',
            fontSize: '1.2rem',
            cursor: 'pointer',
            border: 'none',
            boxShadow: '0 6px 12px rgba(239, 68, 68, 0.5)',
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
    </div>
  );
}
