import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { PageHeader, Card, Badge, Button, Input, Textarea, Modal, Spinner, EmptyState } from '../../components/UI';
import { Gift, Plus, Star } from 'lucide-react';

export default function AdminRewards() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', pointsCost: 100, stock: -1 });

  const fetch = () => {
    api.get('/rewards').then(d => setRewards(d.rewards || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/rewards', form);
    setShowCreate(false);
    setForm({ title: '', description: '', pointsCost: 100, stock: -1 });
    fetch();
  };

  return (
    <div className="animate-in">
      <PageHeader title="Rewards" subtitle="Manage the rewards store" action={<Button onClick={() => setShowCreate(true)}><Plus className="w-4 h-4" /> Add Reward</Button>} />

      {loading ? <Spinner /> : rewards.length === 0 ? (
        <EmptyState icon={<Gift className="w-8 h-8" />} title="No rewards" description="Add rewards for members to redeem." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {rewards.map(r => (
            <Card key={r.id}>
              <h3 className="text-sm font-bold text-white">{r.title}</h3>
              {r.description && <p className="text-xs text-gray-400 mt-1">{r.description}</p>}
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="primary"><Star className="w-3 h-3 mr-0.5" />{r.pointsCost} pts</Badge>
                <Badge variant="default">{r.stock === -1 ? 'Unlimited' : `${r.stock} left`}</Badge>
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
