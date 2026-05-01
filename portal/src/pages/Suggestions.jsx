import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { PageHeader, Card, Badge, Button, Input, Textarea, Modal, Spinner, EmptyState } from '../components/UI';
import { Lightbulb, Plus, Check, X, Clock, Star } from 'lucide-react';

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });
  const [msg, setMsg] = useState('');

  const fetchSuggestions = () => {
    api.get('/suggestions/my').then(d => setSuggestions(d.suggestions || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchSuggestions(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/suggestions', form);
      setForm({ title: '', description: '' });
      setShowCreate(false);
      fetchSuggestions();
    } catch (err) { setMsg(err.message); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="animate-in">
      <PageHeader title="Suggest an Event" subtitle="Propose event ideas — earn points if approved!" action={<Button onClick={() => setShowCreate(true)}><Plus className="w-4 h-4" /> Suggest</Button>} />

      {suggestions.length === 0 ? (
        <EmptyState icon={<Lightbulb className="w-8 h-8" />} title="No suggestions yet" description="Have an idea for a workshop, hackathon, or session? Submit it!" />
      ) : (
        <div className="space-y-2">
          {suggestions.map(s => (
            <Card key={s.id}>
              <div className="flex items-start justify-between gap-3 mb-1">
                <h3 className="text-sm font-semibold text-white">{s.title}</h3>
                <Badge variant={s.status === 'APPROVED' ? 'success' : s.status === 'REJECTED' ? 'danger' : 'warning'}>
                  {s.status === 'APPROVED' && <Check className="w-3 h-3 mr-0.5" />}
                  {s.status === 'REJECTED' && <X className="w-3 h-3 mr-0.5" />}
                  {s.status === 'PENDING' && <Clock className="w-3 h-3 mr-0.5" />}
                  {s.status}
                </Badge>
              </div>
              <p className="text-xs text-gray-400 mb-2">{s.description}</p>
              {s.pointsAwarded > 0 && <Badge variant="primary"><Star className="w-3 h-3 mr-0.5" />+{s.pointsAwarded} pts</Badge>}
              {s.adminNote && <p className="text-xs text-gray-500 mt-1 italic">Admin: {s.adminNote}</p>}
            </Card>
          ))}
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Suggest an Event">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input label="Event Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="e.g. AWS Lambda Deep Dive Workshop" />
          <Textarea label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required placeholder="What should this event cover? Why would it be valuable?" />
          <p className="text-[10px] text-gray-500">If your suggestion is approved by an admin, you'll earn points!</p>
          {msg && <p className="text-xs text-red-400">{msg}</p>}
          <Button type="submit" className="w-full"><Lightbulb className="w-4 h-4" /> Submit Suggestion</Button>
        </form>
      </Modal>
    </div>
  );
}
