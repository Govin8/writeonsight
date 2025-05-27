import React, { useState } from "react";
import "./Login.css"; // You'll create this CSS file next

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = (e) => {
    e.preventDefault();
    setIsLogin(!isLogin);
  };

  return (
    <div className="login-body">
      <header>Write On Sight</header>
      <div className="container" id="auth-container">
        <h2 id="form-title">{isLogin ? "Login" : "Sign Up"}</h2>
        <form id="auth-form">
          {!isLogin && (
            <input type="text" id="name" placeholder="Full Name" required />
          )}
          <input type="email" id="email" placeholder="Email" required />
          <input type="password" id="password" placeholder="Password" required />
          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
          {isLogin && (
            <>
              <button type="button" className="social-btn">Sign in with Facebook</button>
              <button type="button" className="social-btn">Sign in with Google</button>
            </>
          )}
        </form>
        <div className="switch">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <a href="#" onClick={toggleForm}>Sign Up</a>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <a href="#" onClick={toggleForm}>Login</a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

