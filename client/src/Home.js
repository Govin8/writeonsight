import { useState, useEffect } from 'react';

export default function Home({ currentPage, setCurrentPage }) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
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
        Welcome to Write On Sight!
      </h1>

      <p
        style={{
          maxWidth: '700px',
          margin: '1rem auto 0',
          fontSize: '1.25rem',
          lineHeight: '1.8',
          color: '#334155',
          fontWeight: '500',
          animation: 'fadeIn 2s ease-in-out',
        }}
      >
        Write On Sight is your all-in-one tool to extract text from images, edit it instantly, and draft polished content with ease. Whether you're digitizing notes, organizing ideas, or working on your next masterpiece — get started now, right on sight.
      </p>
    </div>
  );
}
