import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { PageHeader, Card, Badge, Button, Input, Textarea, Select, Modal, Spinner, EmptyState } from '../components/UI';
import { HelpCircle, Plus, MessageSquare, Mail, Clock, Check } from 'lucide-react';

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ subject: '', message: '', category: 'general' });
  const [msg, setMsg] = useState('');

  const fetchTickets = () => {
    api.get('/support/my').then(d => setTickets(d.tickets || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/support', form);
      setMsg('Ticket submitted!');
      setForm({ subject: '', message: '', category: 'general' });
      setShowCreate(false);
      fetchTickets();
    } catch (err) { setMsg(err.message); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  const statusIcon = { OPEN: <Clock className="w-3 h-3" />, IN_PROGRESS: <MessageSquare className="w-3 h-3" />, RESOLVED: <Check className="w-3 h-3" />, CLOSED: <Check className="w-3 h-3" /> };
  const statusVariant = { OPEN: 'warning', IN_PROGRESS: 'accent', RESOLVED: 'success', CLOSED: 'default' };

  return (
    <div className="animate-in">
      <PageHeader title="Help & Support" subtitle="Get help or share feedback" action={<Button onClick={() => setShowCreate(true)}><Plus className="w-4 h-4" /> New Ticket</Button>} />

      {/* Contact Info */}
      <Card className="mb-4">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-white">Contact Us</p>
            <p className="text-xs text-gray-400 mt-0.5">Email: <a href="mailto:awscloudclubgeu@gmail.com" className="text-[var(--color-primary)] hover:underline">awscloudclubgeu@gmail.com</a></p>
            <p className="text-xs text-gray-400">Or submit a ticket below and we'll get back to you.</p>
          </div>
        </div>
      </Card>

      {tickets.length === 0 ? (
        <EmptyState icon={<HelpCircle className="w-8 h-8" />} title="No tickets" description="Submit a ticket if you need help or have feedback." />
      ) : (
        <div className="space-y-2">
          {tickets.map(t => (
            <Card key={t.id}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{t.subject}</p>
                  <p className="text-xs text-gray-500">{t.category} · {new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
                <Badge variant={statusVariant[t.status]}>{statusIcon[t.status]} {t.status}</Badge>
              </div>
              <p className="text-xs text-gray-400 mb-2">{t.message}</p>
              {t.adminReply && (
                <div className="bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-lg px-3 py-2 mt-2">
                  <p className="text-[10px] text-[var(--color-primary)] font-semibold mb-0.5">Admin Reply</p>
                  <p className="text-xs text-gray-300">{t.adminReply}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Submit a Ticket">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Select label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            <option value="general">General</option>
            <option value="technical">Technical Issue</option>
            <option value="account">Account</option>
            <option value="feedback">Feedback</option>
          </Select>
          <Input label="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
          <Textarea label="Message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required placeholder="Describe your issue or feedback..." />
          {msg && <p className="text-xs text-emerald-400">{msg}</p>}
          <Button type="submit" className="w-full">Submit Ticket</Button>
        </form>
      </Modal>
    </div>
  );
}
