import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { PageHeader, Card, Button, Input, Select, Textarea, Modal, Spinner, Badge } from '../../components/UI';
import { Award, Plus, Users, Calendar } from 'lucide-react';

export default function AdminCertificates() {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [showIssue, setShowIssue] = useState(false);
  const [showBulkEvent, setShowBulkEvent] = useState(false);
  const [form, setForm] = useState({ userId: '', title: '', description: '', type: 'PARTICIPATION', pointsAwarded: 0 });
  const [bulkForm, setBulkForm] = useState({ eventId: '', title: '', description: '', type: 'PARTICIPATION', pointsAwarded: 0 });
  const [msg, setMsg] = useState('');
  const [bulkMsg, setBulkMsg] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/admin/users?limit=200'),
      api.get('/events?limit=50'),
    ]).then(([u, e]) => { setUsers(u.users || []); setEvents(e.events || []); }).catch(() => {});
  }, []);

  const handleIssue = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/certificates', form);
      setMsg('Certificate issued successfully!');
      setForm({ ...form, userId: '' });
    } catch (err) { setMsg(err.message); }
  };

  const handleBulkEvent = async (e) => {
    e.preventDefault();
    setBulkMsg('');
    try {
      const data = await api.post(`/certificates/event/${bulkForm.eventId}`, {
        title: bulkForm.title, description: bulkForm.description,
        type: bulkForm.type, pointsAwarded: bulkForm.pointsAwarded
      });
      setBulkMsg(`${data.issued} certificates issued, ${data.skipped} skipped`);
    } catch (err) { setBulkMsg(err.message); }
  };

  return (
    <div className="animate-in">
      <PageHeader title="Certificates" subtitle="Issue and manage certificates" action={
        <div className="flex gap-2">
          <Button onClick={() => setShowIssue(true)} size="sm"><Plus className="w-4 h-4" /> Issue Single</Button>
          <Button onClick={() => setShowBulkEvent(true)} size="sm" variant="secondary"><Users className="w-4 h-4" /> Issue to Event</Button>
        </div>
      } />

      <Card>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white">Issue Single Certificate</p>
              <p className="text-xs text-gray-400">Award a certificate to an individual member with a unique QR verification code.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-[var(--color-accent)] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white">Issue to Event Attendees</p>
              <p className="text-xs text-gray-400">One-click bulk issue to everyone who attended a specific event. Duplicates are automatically skipped.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Single Issue Modal */}
      <Modal open={showIssue} onClose={() => { setShowIssue(false); setMsg(''); }} title="Issue Certificate">
        <form onSubmit={handleIssue} className="space-y-3">
          <Select label="Member" value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })} required>
            <option value="">Select member...</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
          </Select>
          <Input label="Certificate Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <Textarea label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <Select label="Type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="PARTICIPATION">Participation</option>
            <option value="ACHIEVEMENT">Achievement</option>
            <option value="AWS_CERT">AWS Certification</option>
          </Select>
          <Input label="Points to Award" type="number" value={form.pointsAwarded} onChange={e => setForm({ ...form, pointsAwarded: parseInt(e.target.value) || 0 })} />
          {msg && <p className="text-xs text-emerald-400">{msg}</p>}
          <Button type="submit" className="w-full">Issue Certificate</Button>
        </form>
      </Modal>

      {/* Bulk Event Issue Modal */}
      <Modal open={showBulkEvent} onClose={() => { setShowBulkEvent(false); setBulkMsg(''); }} title="Issue to Event Attendees">
        <form onSubmit={handleBulkEvent} className="space-y-3">
          <Select label="Event" value={bulkForm.eventId} onChange={e => setBulkForm({ ...bulkForm, eventId: e.target.value })} required>
            <option value="">Select event...</option>
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>{ev.title} ({ev._count?.attendances || 0} attendees)</option>
            ))}
          </Select>
          <Input label="Certificate Title" value={bulkForm.title} onChange={e => setBulkForm({ ...bulkForm, title: e.target.value })} required placeholder="e.g. Cloud Ignite '26 — Participation" />
          <Textarea label="Description" value={bulkForm.description} onChange={e => setBulkForm({ ...bulkForm, description: e.target.value })} />
          <Select label="Type" value={bulkForm.type} onChange={e => setBulkForm({ ...bulkForm, type: e.target.value })}>
            <option value="PARTICIPATION">Participation</option>
            <option value="ACHIEVEMENT">Achievement</option>
          </Select>
          <Input label="Points per Certificate" type="number" value={bulkForm.pointsAwarded} onChange={e => setBulkForm({ ...bulkForm, pointsAwarded: parseInt(e.target.value) || 0 })} />
          <p className="text-[10px] text-gray-500">Each attendee gets a unique certificate with a QR verification code. Members who already have this certificate are skipped.</p>
          {bulkMsg && <p className="text-xs text-emerald-400">{bulkMsg}</p>}
          <Button type="submit" className="w-full"><Users className="w-4 h-4" /> Issue to All Attendees</Button>
        </form>
      </Modal>
    </div>
  );
}
