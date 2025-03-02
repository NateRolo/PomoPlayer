"use client";

import { useState } from "react";

export const AuthModal = ({ onClose, onLogin }: { onClose: () => void; onLogin?: (name: string, email: string) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // This will be connected to the backend later
    console.log("Form submitted:", { email, password, isLogin });
    // For now, just close the modal
    if (onLogin && isLogin) {
      onLogin(email.split('@')[0], email);
    }
    onClose();
  };
  
  return (
    <div className="modal modal-open" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-box w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">
          {isLogin ? "Login" : "Create Account"}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered"
              required
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered"
              required
            />
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Need an account?" : "Already have an account?"}
            </button>
            
            <button type="submit" className="btn btn-primary">
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </div>
          
          <div className="divider">OR</div>
          
          <button
            type="button"
            className="btn btn-outline w-full"
            onClick={() => console.log("Google sign-in clicked")}
          >
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
};
