import { useState } from 'react';
import { api } from '../../lib/api';
import { PageHeader, Card, Button, Input, Textarea, Select } from '../../components/UI';
import { Mail, Send } from 'lucide-react';

export default function AdminEmail() {
  const [form, setForm] = useState({ subject: '', html: '', filter: 'all' });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!confirm(`Send this email to ${form.filter === 'all' ? 'ALL active members' : 'admins only'}?`)) return;
    setSending(true);
    setResult(null);
    try {
      const data = await api.post('/admin/email/send', form);
      setResult(data);
    } catch (err) {
      setResult({ error: err.message });
    }
    setSending(false);
  };

  return (
    <div className="animate-in">
      <PageHeader title="Bulk Email" subtitle="Send emails to members" />

      <div className="max-w-2xl">
        <Card>
          <form onSubmit={handleSend} className="space-y-4">
            <Select label="Recipients" value={form.filter} onChange={e => setForm({ ...form, filter: e.target.value })}>
              <option value="all">All Active Members</option>
              <option value="admins">Admins Only</option>
            </Select>
            <Input label="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Upcoming Workshop This Saturday" required />
            <Textarea label="HTML Body" value={form.html} onChange={e => setForm({ ...form, html: e.target.value })} placeholder="<h2>Hello {{name}},</h2><p>...</p>" required />
            <p className="text-[10px] text-gray-500">Use <code className="text-[var(--color-primary)]">{'{{name}}'}</code> to personalize with the recipient's name. HTML is supported.</p>

            {result && (
              <div className={`text-sm rounded-lg px-3 py-2 border ${result.error ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                {result.error || `Sent to ${result.recipientCount} recipients${result.skipped ? ' (email service not configured — skipped)' : ''}`}
              </div>
            )}

            <Button type="submit" disabled={sending} className="w-full"><Send className="w-4 h-4" /> {sending ? 'Sending...' : 'Send Email'}</Button>
          </form>
        </Card>

        <Card className="mt-4 border-amber-500/20 bg-amber-500/5">
          <p className="text-xs text-gray-400"><strong className="text-white">Email Setup:</strong> Set <code className="text-amber-400">RESEND_API_KEY</code> in your backend <code>.env</code>. Get a free key at <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] underline">resend.com</a> (100 emails/day free).</p>
        </Card>
      </div>
    </div>
  );
}
