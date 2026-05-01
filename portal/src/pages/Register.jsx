import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input, Button } from '../components/UI';

export default function Register() {
  const { register, loginWithGoogle } = useAuth();
  const [searchParams] = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState(searchParams.get('ref') || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [regOpen, setRegOpen] = useState(true);
  const [checkingReg, setCheckingReg] = useState(true);
  const googleInitRef = useRef(false);
  const loginWithGoogleRef = useRef(loginWithGoogle);
  const referralCodeRef = useRef(referralCode);
  loginWithGoogleRef.current = loginWithGoogle;
  referralCodeRef.current = referralCode;

  useEffect(() => {
    fetch('http://localhost:4000/api/auth/registration-status')
      .then(r => r.json())
      .then(d => setRegOpen(d.registrationOpen))
      .catch(() => {})
      .finally(() => setCheckingReg(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try { await register(name, email, password, referralCode); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (googleInitRef.current) return;
    googleInitRef.current = true;

    fetch('http://localhost:4000/api/auth/google-client-id')
      .then(r => r.json())
      .then(({ clientId }) => {
        if (!clientId) return;
        if (window.google?.accounts) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response) => {
              try { await loginWithGoogleRef.current(response.credential, referralCodeRef.current); }
              catch (err) { setError(err.message); }
            },
          });
          const btn = document.getElementById('google-signup-btn');
          if (btn) window.google.accounts.id.renderButton(btn, { theme: 'filled_black', size: 'large', width: 350, text: 'signup_with', shape: 'rectangular' });
          setGoogleReady(true);
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.onload = () => {
          try {
            window.google?.accounts.id.initialize({
              client_id: clientId,
              callback: async (response) => {
                try { await loginWithGoogleRef.current(response.credential, referralCodeRef.current); }
                catch (err) { setError(err.message); }
              },
            });
            const btn = document.getElementById('google-signup-btn');
            if (btn) window.google.accounts.id.renderButton(btn, { theme: 'filled_black', size: 'large', width: 350, text: 'signup_with', shape: 'rectangular' });
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
          <h1 className="text-2xl font-bold text-white">Join the Builders</h1>
          <p className="text-sm text-gray-400 mt-1">Create your portal account</p>
        </div>

        {!checkingReg && !regOpen ? (
          <div className="bg-[var(--color-surface)] border border-white/5 rounded-2xl p-6 text-center">
            <p className="text-sm text-amber-400 mb-2">Registration is currently closed</p>
            <p className="text-xs text-gray-400 mb-4">Contact the admin to get an account, or login if you already have one.</p>
            <Link to="/login" className="text-[var(--color-primary)] font-semibold text-sm hover:underline">Go to Login</Link>
          </div>
        ) : (
        <div className="bg-[var(--color-surface)] border border-white/5 rounded-2xl p-6 space-y-4">
          {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}

          <div id="google-signup-btn" className="flex justify-center" />

          {googleReady && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-500">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 characters" required minLength={8} />
            <Input label="Referral Code (optional)" value={referralCode} onChange={e => setReferralCode(e.target.value)} placeholder="e.g. ADMIN001" />
            <Button type="submit" disabled={loading} className="w-full">{loading ? 'Creating account...' : 'Create Account'}</Button>
          </form>
        </div>
        )}

        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account? <Link to="/login" className="text-[var(--color-primary)] font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
