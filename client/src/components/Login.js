import { useState } from 'react';
import { auth, googleProvider, facebookProvider, signInWithPopup } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Login({ setLoggedIn, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [users, setUsers] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password.trim()) {
      setError('Password is required.');
      return;
    }
    if (!isLogin && !name.trim()) {
      setError('Name is required for sign up.');
      return;
    }
    if (!isLogin && !validatePassword(password)) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        setLoggedIn(true);
        onLoginSuccess({ name: user.displayName || 'New user', email: user.email });
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: name });
        await setDoc(doc(db, 'users', user.uid), {
          name,
          email,
          avatar: 'https://via.placeholder.com/150',
        });
        alert(`Signed up successfully as ${name}. Please log in now.`);
        setIsLogin(true);
      }
    } catch (error) {
      console.error(`${isLogin ? 'Login' : 'Signup'} error:`, error.message);
      setError(error.message.includes('wrong-password') ? 'Incorrect email or password.' :
                error.message.includes('user-not-found') ? 'No account found with this email.' :
                error.message.includes('email-already-in-use') ? 'This email is already registered.' :
                'An error occurred. Please try again.');
    }
  };

  const onGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        setLoggedIn(true);
        onLoginSuccess({ name: user.displayName, email: user.email });
      })
      .catch((error) => {
        console.error('Google Sign-In Error:', error.message);
        setError('Google sign-in failed. Please try again.');
      });
  };

  const onFacebookSignIn = () => {
    signInWithPopup(auth, facebookProvider)
      .then((result) => {
        const user = result.user;
        setLoggedIn(true);
        onLoginSuccess({ name: user.displayName, email: user.email });
      })
      .catch((error) => {
        console.error('Facebook Sign-In Error:', error.message);
        setError('Facebook sign-in failed. Please try again.');
      });
  };

  return (
    <div
      className="login-wrapper"
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        background: 'linear-gradient(135deg, #e0f2fe, #dbeafe, #f3e8ff)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.15), transparent 70%)',
          animation: 'gradientShift 15s ease-in-out infinite',
          zIndex: 0,
        }}
      />
      <div
        className="left-section"
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          className="logo-container"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '0',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15), inset 0 0 10px rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.5s ease',
            animation: 'fadeInSlideUp 1s ease-out',
            padding: '0',
            width: '50%',
            maxWidth: '400px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.2), inset 0 0 15px rgba(255, 255, 255, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15), inset 0 0 10px rgba(255, 255, 255, 0.1)';
          }}
        >
          <img
            src="https://i.postimg.cc/jCLNDXkp/Whats-App-Image-2025-06-01-at-14-13-20.jpg"
            alt="Write On Sight Logo"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
        </div>
      </div>
      <div
        className="right-section"
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          className="container login-box"
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '3rem 2.5rem',
            borderRadius: '24px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.2), inset 0 0 15px rgba(255, 255, 255, 0.1)',
            maxWidth: '480px',
            width: '90%',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'all 0.5s ease',
            animation: 'fadeInSlideUp 1s ease-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.25), inset 0 0 20px rgba(255, 255, 255, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.2), inset 0 0 15px rgba(255, 255, 255, 0.1)';
          }}
        >
          <h2
            style={{
              marginBottom: '2rem',
              fontSize: '2rem',
              textAlign: 'center',
              fontWeight: '800',
              color: '#1e293b',
              letterSpacing: '0.05em',
              background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'textGlow 2s ease-in-out infinite',
              textShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
            }}
          >
            {isLogin ? 'Login to Write On Sight' : 'Join Write On Sight'}
          </h2>
          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                marginBottom: '1.5rem',
                width: '100%',
                textAlign: 'center',
                fontSize: '0.95rem',
                fontWeight: '500',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                animation: 'slideInError 0.5s ease-out',
                boxShadow: '0 2px 6px rgba(239, 68, 68, 0.2)',
              }}
            >
              {error}
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  padding: '1rem 1.5rem',
                  marginBottom: '1.5rem',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '14px',
                  fontSize: '1.1rem',
                  fontWeight: '400',
                  color: '#1e293b',
                  background: 'rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.4s ease',
                  outline: 'none',
                  width: '100%',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                  animation: 'slideIn 0.5s ease-out',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#8b5cf6';
                  e.currentTarget.style.boxShadow = '0 0 12px rgba(139, 92, 246, 0.5)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: '1rem 1.5rem',
                marginBottom: '1.5rem',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '14px',
                fontSize: '1.1rem',
                fontWeight: '400',
                color: '#1e293b',
                background: 'rgba(255, 255, 255, 0.2)',
                transition: 'all 0.4s ease',
                outline: 'none',
                width: '100%',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                animation: 'slideIn 0.6s ease-out',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#8b5cf6';
                e.currentTarget.style.boxShadow = '0 0 12px rgba(139, 92, 246, 0.5)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: '1rem 1.5rem',
                marginBottom: '1.5rem',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '14px',
                fontSize: '1.1rem',
                fontWeight: '400',
                color: '#1e293b',
                background: 'rgba(255, 255, 255, 0.2)',
                transition: 'all 0.4s ease',
                outline: 'none',
                width: '100%',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                animation: 'slideIn 0.7s ease-out',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#8b5cf6';
                e.currentTarget.style.boxShadow = '0 0 12px rgba(139, 92, 246, 0.5)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            />
            <button
              type="submit"
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6)',
                color: 'white',
                borderRadius: '14px',
                fontSize: '1.2rem',
                fontWeight: '700',
                cursor: 'pointer',
                marginBottom: '1.5rem',
                transition: 'all 0.4s ease',
                border: 'none',
                boxShadow: '0 6px 15px rgba(139, 92, 246, 0.4)',
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                animation: 'buttonGlow 2s ease-in-out infinite',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #0891b2, #2563eb, #7c3aed)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.6)';
                e.currentTarget.style.transform = 'scale(1.03)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6)';
                e.currentTarget.style.boxShadow = '0 6px 15px rgba(139, 92, 246, 0.4)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              onMouseDown={(e) => {
                const ripple = document.createElement('span');
                ripple.style.position = 'absolute';
                ripple.style.background = 'rgba(255, 255, 255, 0.3)';
                ripple.style.borderRadius = '50%';
                ripple.style.width = '100px';
                ripple.style.height = '100px';
                ripple.style.left = `${e.clientX - e.currentTarget.getBoundingClientRect().left - 50}px`;
                ripple.style.top = `${e.clientY - e.currentTarget.getBoundingClientRect().top - 50}px`;
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s ease-out';
                e.currentTarget.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
              }}
            >
              {isLogin ? 'Login' : 'Sign Up'}
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
                onMouseOver={(e) => (e.currentTarget.style.left = '100%')}
              />
            </button>
            {isLogin && (
              <>
                <button
                  type="button"
                  className="social-btn facebook"
                  onClick={onFacebookSignIn}
                  style={{
                    background: 'linear-gradient(90deg, #3b5998, #4f74c8)',
                    color: 'white',
                    borderRadius: '14px',
                    padding: '1rem 1.5rem',
                    fontWeight: '600',
                    border: 'none',
                    transition: 'all 0.4s ease',
                    boxShadow: '0 6px 15px rgba(59, 89, 152, 0.4)',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.9rem',
                    marginBottom: '1rem',
                    position: 'relative',
                    overflow: 'hidden',
                    animation: 'slideIn 0.8s ease-out',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(90deg, #2d4373, #3b5998)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 89, 152, 0.5)';
                    e.currentTarget.style.transform = 'scale(1.03)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(90deg, #3b5998, #4f74c8)';
                    e.currentTarget.style.boxShadow = '0 6px 15px rgba(59, 89, 152, 0.4)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onMouseDown={(e) => {
                    const ripple = document.createElement('span');
                    ripple.style.position = 'absolute';
                    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
                    ripple.style.borderRadius = '50%';
                    ripple.style.width = '100px';
                    ripple.style.height = '100px';
                    ripple.style.left = `${e.clientX - e.currentTarget.getBoundingClientRect().left - 50}px`;
                    ripple.style.top = `${e.clientY - e.currentTarget.getBoundingClientRect().top - 50}px`;
                    ripple.style.transform = 'scale(0)';
                    ripple.style.animation = 'ripple 0.6s ease-out';
                    e.currentTarget.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 600);
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22 12C22 6.48 17.52 2 12 2S2 6.48 2 12c0 5.02 3.66 9.16 8.44 9.88v-6.98h-2.54v-2.9h2.54V9.56c0-2.52 1.5-3.9 3.8-3.9 1.1 0 2.26.2 2.26.2v2.48h-1.27c-1.25 0-1.64.78-1.64 1.58v1.98h2.8l-.45 2.9h-2.35v6.98C18.34 21.16 22 17.02 22 12z"
                      fill="white"
                    />
                  </svg>
                  Sign in with Facebook
                </button>
                <button
                  type="button"
                  className="social-btn google"
                  onClick={onGoogleSignIn}
                  style={{
                    background: 'linear-gradient(90deg, #4285f4, #34A853)',
                    color: 'white',
                    borderRadius: '14px',
                    padding: '1rem 1.5rem',
                    fontWeight: '600',
                    border: 'none',
                    transition: 'all 0.4s ease',
                    boxShadow: '0 6px 15px rgba(66, 133, 244, 0.4)',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.9rem',
                    position: 'relative',
                    overflow: 'hidden',
                    animation: 'slideIn 0.9s ease-out',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(90deg, #3267d6, #2c9044)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(66, 133, 244, 0.5)';
                    e.currentTarget.style.transform = 'scale(1.03)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(90deg, #4285f4, #34A853)';
                    e.currentTarget.style.boxShadow = '0 6px 15px rgba(66, 133, 244, 0.4)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onMouseDown={(e) => {
                    const ripple = document.createElement('span');
                    ripple.style.position = 'absolute';
                    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
                    ripple.style.borderRadius = '50%';
                    ripple.style.width = '100px';
                    ripple.style.height = '100px';
                    ripple.style.left = `${e.clientX - e.currentTarget.getBoundingClientRect().left - 50}px`;
                    ripple.style.top = `${e.clientY - e.currentTarget.getBoundingClientRect().top - 50}px`;
                    ripple.style.transform = 'scale(0)';
                    ripple.style.animation = 'ripple 0.6s ease-out';
                    e.currentTarget.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 600);
                  }}
                >
                  <a href="https://postimages.org/" target="_blank">
                    <img
                      src="https://i.postimg.cc/26bM5kL4/temp-Imagesuw4-Ky.avif"
                      border="0"
                      alt="temp-Imagesuw4-Ky"
                      style={{
                        width: '24px',
                        height: '24px',
                        display: 'block',
                      }}
                    />
                  </a>
                  Sign in with Google
                </button>
              </>
            )}
          </form>
          <div
            className="switch"
            style={{
              textAlign: 'center',
              marginTop: '1.5rem',
              fontSize: '1rem',
              color: '#94a3b8',
              animation: 'fadeIn 1s ease-out',
            }}
          >
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <a
                  href="#"
                  onClick={() => setIsLogin(false)}
                  style={{
                    color: '#8b5cf6',
                    textDecoration: 'none',
                    fontWeight: '700',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#a78bfa';
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = '#8b5cf6';
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  Sign Up
                </a>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <a
                  href="#"
                  onClick={() => setIsLogin(true)}
                  style={{
                    color: '#8b5cf6',
                    textDecoration: 'none',
                    fontWeight: '700',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#a78bfa';
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = '#8b5cf6';
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  Login
                </a>
              </>
            )}
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes gradientShift {
            0% { background: radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.15), transparent 70%); }
            50% { background: radial-gradient(circle at 70% 80%, rgba(6, 182, 212, 0.15), transparent 70%); }
            100% { background: radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.15), transparent 70%); }
          }
          @keyframes fadeInSlideUp {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideIn {
            0% { opacity: 0; transform: translateX(-20px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          @keyframes textGlow {
            0% { text-shadow: 0 2px 8px rgba(139, 92, 246, 0.3); }
            50% { text-shadow: 0 4px 12px rgba(139, 92, 246, 0.5); }
            100% { text-shadow: 0 2px 8px rgba(139, 92, 246, 0.3); }
          }
          @keyframes buttonGlow {
            0% { box-shadow: 0 6px 15px rgba(139, 92, 246, 0.4); }
            50% { box-shadow: 0 8px 20px rgba(139, 92, 246, 0.6); }
            100% { box-shadow: 0 6px 15px rgba(139, 92, 246, 0.4); }
          }
          @keyframes ripple {
            0% { transform: scale(0); opacity: 1; }
            100% { transform: scale(4); opacity: 0; }
          }
          @keyframes slideInError {
            0% { opacity: 0; transform: translateY(-10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          @media (max-width: 768px) {
            .login-wrapper {
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }
            .left-section, .right-section {
              flex: none;
              width: 100%;
              justify-content: center;
            }
            .left-section {
              margin-bottom: 2rem;
            }
            .logo-container {
              width: 70%;
              max-width: 300px;
            }
            .login-box {
              width: 80%;
            }
          }
        `}
      </style>
    </div>
  );
}
