import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { PageHeader, Card, Badge, Button, Input, Textarea, Modal, Spinner, EmptyState } from '../../components/UI';
import { Gift, Plus, Star, EyeOff, Eye, Trash2 } from 'lucide-react';

export default function AdminRewards() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', pointsCost: 100, stock: -1 });

  const fetchRewards = () => {
    api.get('/rewards/all').then(d => setRewards(d.rewards || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchRewards(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/rewards', form);
    setShowCreate(false);
    setForm({ title: '', description: '', pointsCost: 100, stock: -1 });
    fetchRewards();
  };

  const toggleActive = async (id, isActive) => {
    await api.put(`/rewards/${id}`, { isActive: !isActive });
    fetchRewards();
  };

  return (
    <div className="animate-in">
      <PageHeader title="Rewards" subtitle="Manage the rewards store" action={<Button onClick={() => setShowCreate(true)}><Plus className="w-4 h-4" /> Add Reward</Button>} />

      {loading ? <Spinner /> : rewards.length === 0 ? (
        <EmptyState icon={<Gift className="w-8 h-8" />} title="No rewards" description="Add rewards for members to redeem." />
      ) : (
        <div className="space-y-2">
          {rewards.map(r => (
            <Card key={r.id} className={`flex items-center gap-4 ${!r.isActive ? 'opacity-50' : ''}`}>
              <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{r.title}</p>
                {r.description && <p className="text-xs text-gray-500 truncate">{r.description}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="primary"><Star className="w-3 h-3 mr-0.5" />{r.pointsCost}</Badge>
                <Badge variant={r.isActive ? 'success' : 'danger'}>{r.isActive ? 'Active' : 'Disabled'}</Badge>
                <Badge>{r.stock === -1 ? '∞' : `${r.stock} left`}</Badge>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button size="sm" variant={r.isActive ? 'danger' : 'secondary'} onClick={() => toggleActive(r.id, r.isActive)}>
                  {r.isActive ? <><EyeOff className="w-3.5 h-3.5" /> Disable</> : <><Eye className="w-3.5 h-3.5" /> Enable</>}
                </Button>
                <Button size="sm" variant="ghost" onClick={async () => { if (confirm('Delete this reward permanently?')) { await api.delete(`/rewards/${r.id}`); fetchRewards(); } }} title="Delete">
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add Reward">
        <form onSubmit={handleCreate} className="space-y-3">
          <Input label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <Textarea label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <Input label="Points Cost" type="number" value={form.pointsCost} onChange={e => setForm({ ...form, pointsCost: parseInt(e.target.value) || 0 })} required />
          <Input label="Stock (-1 for unlimited)" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: parseInt(e.target.value) })} />
          <Button type="submit" className="w-full">Add Reward</Button>
        </form>
      </Modal>
    </div>
  );
}
