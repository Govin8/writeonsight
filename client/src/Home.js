import { useState, useEffect } from 'react';

export default function Home({ currentPage, setCurrentPage }) {
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
      Welcome to Write On Sight!
    </h1>
  );
}