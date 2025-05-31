import { useState } from 'react';
import { auth, googleProvider, facebookProvider, signInWithPopup } from '../firebase';

export default function Login({ setLoggedIn, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [users, setUsers] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      if (users[email] === password) {
        setLoggedIn(true);
        onLoginSuccess({ name: users[email + '_name'], email }); // Pass name and email
      } else {
        alert("Incorrect email or password, or you haven't signed up yet.");
      }
    } else {
      if (users[email]) {
        alert("This email is already registered.");
      } else {
        setUsers({ ...users, [email]: password, [email + '_name']: name });
        alert(`Signed up successfully as ${name}. Please log in now.`);
        setIsLogin(true);
      }
    }
  };

  const onGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        console.log("Google user:", user);
        setLoggedIn(true);
        onLoginSuccess({ name: user.displayName, email: user.email }); // Pass Google name and email
      })
      .catch((error) => {
        console.error("Google Sign-In Error:", error.message);
        alert("Google sign-in failed. Try again.");
      });
  };

  const onFacebookSignIn = () => {
    signInWithPopup(auth, facebookProvider)
      .then((result) => {
        const user = result.user;
        console.log("Facebook user:", user);
        setLoggedIn(true);
        onLoginSuccess({ name: user.displayName, email: user.email }); // Pass Facebook name and email
      })
      .catch((error) => {
        console.error("Facebook Sign-In Error:", error.message);
        alert("Facebook sign-in failed. Try again.");
      });
  };

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
        {isLogin ? "Login" : "Sign Up"}
      </h2>
      <div 
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
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
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
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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
        <button 
          type="button" 
          onClick={handleSubmit}
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
          {isLogin ? "Login" : "Sign Up"}
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
        {isLogin && (
          <>
            <button 
              type="button" 
              className="social-btn facebook" 
              onClick={onFacebookSignIn}
              style={{
                background: 'linear-gradient(90deg, #3b5998, #4f74c8)',
                color: 'white',
                borderRadius: '12px',
                padding: '1rem',
                fontWeight: '600',
                border: '2px solid #2d4373',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 10px rgba(59, 89, 152, 0.4)',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.9rem',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #2d4373, #3b5998)';
                e.currentTarget.style.boxShadow = '0 6px 14px rgba(59, 89, 152, 0.5)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #3b5998, #4f74c8)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(59, 89, 152, 0.4)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Sign in with Facebook
            </button>
            <button 
              type="button" 
              className="social-btn google" 
              onClick={onGoogleSignIn}
              style={{
                background: 'linear-gradient(90deg, #34A853, #2c9044)',
                color: 'white',
                borderRadius: '12px',
                padding: '1rem',
                fontWeight: '600',
                border: '2px solid #2c9044',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 10px rgba(52, 168, 83, 0.4)',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.9rem',
                marginTop: '1rem',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #2c9044, #247a38)';
                e.currentTarget.style.borderColor = '#247a38';
                e.currentTarget.style.boxShadow = '0 6px 14px rgba(52, 168, 83, 0.5)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #34A853, #2c9044)';
                e.currentTarget.style.borderColor = '#2c9044';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(52, 168, 83, 0.4)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Sign in with Google
            </button>
          </>
        )}
      </div>
      <div 
        className="switch"
        style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: '1rem',
          color: '#64748b',
        }}
      >
        {isLogin ? (
          <>Don't have an account? <a 
            href="#" 
            onClick={() => setIsLogin(false)}
            style={{
              color: '#8b5cf6',
              textDecoration: 'none',
              fontWeight: '700',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#7c3aed';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#8b5cf6';
              e.currentTarget.style.textDecoration = 'none';
            }}
          >Sign Up</a></>
        ) : (
          <>Already have an account? <a 
            href="#" 
            onClick={() => setIsLogin(true)}
            style={{
              color: '#8b5cf6',
              textDecoration: 'none',
              fontWeight: '700',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#7c3aed';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#8b5cf6';
              e.currentTarget.style.textDecoration = 'none';
            }}
          >Login</a></>
        )}
      </div>
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(15px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
