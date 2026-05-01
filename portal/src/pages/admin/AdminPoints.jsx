import { useState } from 'react';
import { api } from '../../lib/api';
import { PageHeader, Card, Button, Input, Textarea, Modal } from '../../components/UI';
import { Star, Plus } from 'lucide-react';
import MemberSearch from '../../components/MemberSearch';

export default function AdminPoints() {
  const [showAdjust, setShowAdjust] = useState(false);
  const [form, setForm] = useState({ userId: '', points: 0, reason: '' });
  const [msg, setMsg] = useState('');

  const handleAdjust = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/points/adjust', form);
      setMsg('Points adjusted successfully!');
      setForm({ userId: '', points: 0, reason: '' });
    } catch (err) { setMsg(err.message); }
  };

  return (
    <div className="animate-in">
      <PageHeader title="Points Management" subtitle="Manually adjust member points" action={<Button onClick={() => setShowAdjust(true)}><Plus className="w-4 h-4" /> Adjust Points</Button>} />

      <Card>
        <p className="text-sm text-gray-400">Points are automatically awarded for attendance, certifications, referrals, and resource completion. Use manual adjustment for special cases like hackathon prizes or corrections.</p>
      </Card>

      <Modal open={showAdjust} onClose={() => { setShowAdjust(false); setMsg(''); }} title="Adjust Points">
        <form onSubmit={handleAdjust} className="space-y-3">
          <MemberSearch value={form.userId} onChange={(id) => setForm({ ...form, userId: id })} />
          <Input label="Points (negative to deduct)" type="number" value={form.points} onChange={e => setForm({ ...form, points: parseInt(e.target.value) || 0 })} required />
          <Textarea label="Reason (required)" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} required placeholder="e.g. Hackathon winner prize" />
          {msg && <p className="text-xs text-emerald-400">{msg}</p>}
          <Button type="submit" className="w-full">Adjust Points</Button>
        </form>
      </Modal>
    </div>
  );
}
