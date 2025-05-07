import React, { useState } from "react";
import "./file.css";

export default function NeumorphicLogin() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className={`neu-container ${isSignUp ? "sign-up-mode" : ""}`}>
      <div className="neu-card login">
        <h2>Welcome Back</h2>
        <label>Email</label>
        <input type="email" placeholder="Enter your email" />
        <label>Password</label>
        <input type="password" placeholder="Enter your password" />
        <button className="neu-btn">Log In</button>
        <p className="forgot">Forgot password?</p>
    
      </div>

      <div className="neu-card signup">
        <h2>New Here?</h2>
        <p>Sign up and discover a great amount of new opportunities!</p>
        <button className="neu-btn outline" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Back to Login" : "Sign Up"}
        </button>
      </div>
    </div>
  );
}
