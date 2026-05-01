import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input, Button } from '../components/UI';

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [regOpen, setRegOpen] = useState(true);
  const googleInitRef = useRef(false);
  const loginWithGoogleRef = useRef(loginWithGoogle);
  loginWithGoogleRef.current = loginWithGoogle;

  useEffect(() => {
    fetch('http://localhost:4000/api/auth/registration-status').then(r => r.json()).then(d => setRegOpen(d.registrationOpen)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try { await login(email, password); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  // Load Google Sign-In once
  useEffect(() => {
    if (googleInitRef.current) return;
    googleInitRef.current = true;

    fetch('http://localhost:4000/api/auth/google-client-id')
      .then(r => r.json())
      .then(({ clientId }) => {
        if (!clientId) return;
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.onload = () => {
          try {
            window.google?.accounts.id.initialize({
              client_id: clientId,
              callback: async (response) => {
                try { await loginWithGoogleRef.current(response.credential); }
                catch (err) { setError(err.message); }
              },
            });
            const btn = document.getElementById('google-signin-btn');
            if (btn) {
              window.google.accounts.id.renderButton(btn, { theme: 'filled_black', size: 'large', width: 350, text: 'continue_with', shape: 'rectangular' });
            }
            setGoogleReady(true);
          } catch {}
        };
        document.head.appendChild(script);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--color-bg)]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-sm text-gray-400 mt-1">Sign in to your builder portal</p>
        </div>

        <div className="bg-[var(--color-surface)] border border-white/5 rounded-2xl p-6 space-y-4">
          {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}

          <div id="google-signin-btn" className="flex justify-center" />

          {googleReady && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-500">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            <Button type="submit" disabled={loading} className="w-full">{loading ? 'Signing in...' : 'Sign In'}</Button>
          </form>
        </div>

        {regOpen && (
          <p className="text-center text-sm text-gray-400 mt-4">
            Don't have an account? <Link to="/register" className="text-[var(--color-primary)] font-semibold hover:underline">Register</Link>
          </p>
        )}
        {!regOpen && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Registration is currently closed. Contact admin for access.
          </p>
        )}
      </div>
    </div>
  );
}
