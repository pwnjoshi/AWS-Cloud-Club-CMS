import { useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { PageHeader, Card, Input, Textarea, Button, Badge } from '../components/UI';
import { User, Save } from 'lucide-react';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      await api.put('/users/profile', { name, bio });
      await refreshUser();
      setMsg('Profile updated');
    } catch (err) {
      setMsg(err.message);
    }
    setSaving(false);
  };

  return (
    <div className="animate-in">
      <PageHeader title="Profile" subtitle="Manage your account" />

      <div className="max-w-lg">
        <Card className="mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] text-2xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-bold text-white">{user?.name}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <Badge variant={user?.role === 'ADMIN' ? 'danger' : 'primary'}>{user?.role}</Badge>
            </div>
          </div>
        </Card>

        <Card>
          <form onSubmit={handleSave} className="space-y-4">
            <Input label="Name" value={name} onChange={e => setName(e.target.value)} required />
            <Textarea label="Bio" value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself..." />
            {msg && <p className="text-xs text-gray-400">{msg}</p>}
            <Button type="submit" disabled={saving}><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
