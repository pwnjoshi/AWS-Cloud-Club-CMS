import { useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Input, Button } from '../components/UI';
import { Lock } from 'lucide-react';

export default function ResetPassword() {
  const { refreshUser } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { newPassword: password });
      await refreshUser();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--color-bg)]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-[var(--color-primary)]" />
          </div>
          <h1 className="text-2xl font-bold text-white">Set Your Password</h1>
          <p className="text-sm text-gray-400 mt-1">Please create a new password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[var(--color-surface)] border border-white/5 rounded-2xl p-6 space-y-4">
          {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
          <Input label="New Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 characters" required minLength={8} />
          <Input label="Confirm Password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Re-enter password" required />
          <Button type="submit" disabled={loading} className="w-full">{loading ? 'Setting password...' : 'Set Password & Continue'}</Button>
        </form>
      </div>
    </div>
  );
}
