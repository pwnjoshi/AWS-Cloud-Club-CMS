import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { PageHeader, Card, Badge, Button, Input, Textarea, Modal, Spinner } from '../../components/UI';
import { Calendar, Plus, Key, Users } from 'lucide-react';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [otpModal, setOtpModal] = useState(null);
  const [otp, setOtp] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', date: '', location: '', registrationLink: '', pointsReward: 50 });

  const fetchEvents = () => {
    api.get('/events?limit=50').then(d => setEvents(d.events || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/events', form);
    setShowCreate(false);
    setForm({ title: '', description: '', date: '', location: '', registrationLink: '', pointsReward: 50 });
    fetchEvents();
  };

  const generateOtp = async (eventId) => {
    const data = await api.post('/attendance/otp', { eventId, expiresInMinutes: 10 });
    setOtp(data.otp);
    setOtpModal(eventId);
  };

  return (
    <div className="animate-in">
      <PageHeader title="Events" subtitle="Manage events" action={<Button onClick={() => setShowCreate(true)}><Plus className="w-4 h-4" /> Create Event</Button>} />

      {loading ? <div className="flex justify-center py-10"><Spinner /></div> : (
        <div className="space-y-2">
          {events.map(ev => (
            <Card key={ev.id} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{ev.title}</p>
                <p className="text-xs text-gray-500">{new Date(ev.date).toLocaleDateString()} · {ev._count?.attendances || 0} attended</p>
              </div>
              <Button size="sm" variant="secondary" onClick={() => generateOtp(ev.id)}><Key className="w-3.5 h-3.5" /> OTP</Button>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Event">
        <form onSubmit={handleCreate} className="space-y-3">
          <Input label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <Textarea label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <Input label="Date & Time" type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
          <Input label="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
          <Input label="Registration Link" value={form.registrationLink} onChange={e => setForm({ ...form, registrationLink: e.target.value })} />
          <Input label="Points Reward" type="number" value={form.pointsReward} onChange={e => setForm({ ...form, pointsReward: parseInt(e.target.value) })} />
          <Button type="submit" className="w-full">Create Event</Button>
        </form>
      </Modal>

      {/* OTP Modal */}
      <Modal open={!!otpModal} onClose={() => { setOtpModal(null); setOtp(null); }} title="Event Check-in OTP">
        {otp && (
          <div className="text-center py-4">
            <p className="text-5xl font-bold text-[var(--color-primary)] font-mono tracking-widest mb-4">{otp.code}</p>
            <p className="text-sm text-gray-400">Expires: {new Date(otp.expiresAt).toLocaleTimeString()}</p>
            <p className="text-xs text-gray-500 mt-2">Show this code to students for check-in</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
