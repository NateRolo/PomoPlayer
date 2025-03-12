"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

// Define proper types for the user object
interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface AuthModalProps {
  onClose: () => void;
  onLogin?: (user: User) => void;
}

interface AuthError {
  message: string;
  status?: number;
}

export const AuthModal = ({ onClose, onLogin }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        if (onLogin && data.user) onLogin(data.user as User);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        if (data.user) {
          alert("Check your email for the confirmation link!");
        }
      }
      
      onClose();
    } catch (error) {
      const authError = error as AuthError;
      setError(authError.message || "An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <div className="modal modal-open" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-box w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">
          {isLogin ? "Login" : "Create Account"}
        </h3>
        
        {error && (
          <div className="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
          </div>
        )}
        
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setIsLogin(!isLogin)}
              disabled={loading}
            >
              {isLogin ? "Need an account?" : "Already have an account?"}
            </button>
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="loading loading-spinner"></span> : (isLogin ? "Login" : "Sign Up")}
            </button>
          </div>
          
          
        </form>
      </div>
    </div>
  );
};
