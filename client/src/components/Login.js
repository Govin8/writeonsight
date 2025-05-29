import { useState } from 'react';
import './Login.css';
import { auth, googleProvider, facebookProvider, signInWithPopup } from '../firebase';



export default function Login({ setLoggedIn }) {
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
      } else {
        alert("Incorrect email or password, or you haven't signed up yet.");
      }
    } else {
      if (users[email]) {
        alert("This email is already registered.");
      } else {
        setUsers({ ...users, [email]: password });
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
    })
    .catch((error) => {
      console.error("Facebook Sign-In Error:", error.message);
      alert("Facebook sign-in failed. Try again.");
    });
};


  return (
    <div className="container">
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        {isLogin && (
          <>
            <button type="button" className="social-btn facebook" onClick={onFacebookSignIn}>Sign in with Facebook</button>
            <button type="button" className="social-btn google" onClick={onGoogleSignIn}>Sign in with Google</button>
          </>
        )}
      </form>
      <div className="switch">
        {isLogin ? (
          <>Don't have an account? <a href="#" onClick={() => setIsLogin(false)}>Sign Up</a></>
        ) : (
          <>Already have an account? <a href="#" onClick={() => setIsLogin(true)}>Login</a></>
        )}
      </div>
    </div>
  );
}