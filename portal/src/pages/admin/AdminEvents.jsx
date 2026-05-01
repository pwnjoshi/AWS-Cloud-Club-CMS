import { useEffect, useState, useRef, useCallback } from 'react';
import { api } from '../../lib/api';
import { PageHeader, Card, Badge, Button, Input, Textarea, Modal, Spinner } from '../../components/UI';
import { Calendar, Plus, Radio, Square, MapPin, Clock, Users, Settings, UserPlus } from 'lucide-react';
import MemberSearch from '../../components/MemberSearch';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [checkinModal, setCheckinModal] = useState(null);
  const [addAttendeeModal, setAddAttendeeModal] = useState(null); // eventId
  const [addAttendeeUser, setAddAttendeeUser] = useState('');
  const [addAttendeeMsg, setAddAttendeeMsg] = useState('');
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
              <div className="flex gap-1 shrink-0">
                <Button size="sm" variant="secondary" onClick={() => setCheckinModal(ev.id)}>
                  <Radio className="w-3.5 h-3.5" /> Check-in
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setAddAttendeeModal(ev.id); setAddAttendeeUser(''); setAddAttendeeMsg(''); }}>
                  <UserPlus className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Event Modal */}
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

      {/* Check-in Session Modal */}
      <Modal open={!!checkinModal} onClose={() => setCheckinModal(null)} title="Event Check-in">
        {checkinModal && <CheckinPanel eventId={checkinModal} />}
      </Modal>

      {/* Add Attendee Modal */}
      <Modal open={!!addAttendeeModal} onClose={() => setAddAttendeeModal(null)} title="Add Attendee Manually">
        <div className="space-y-3">
          <p className="text-xs text-gray-400">Manually add a member to this event's attendance. Use this when a student couldn't scan the QR or enter the code.</p>
          <MemberSearch value={addAttendeeUser} onChange={(id) => setAddAttendeeUser(id)} />
          {addAttendeeMsg && <p className="text-xs text-emerald-400">{addAttendeeMsg}</p>}
          <Button
            className="w-full"
            disabled={!addAttendeeUser}
            onClick={async () => {
              setAddAttendeeMsg('');
              try {
                await api.post('/attendance/manual', { userId: addAttendeeUser, eventId: addAttendeeModal });
                setAddAttendeeMsg('Attendee added successfully! Points awarded.');
                setAddAttendeeUser('');
                fetchEvents();
              } catch (err) { setAddAttendeeMsg(err.message); }
            }}
          >
            <UserPlus className="w-4 h-4" /> Add Attendee
          </Button>
        </div>
      </Modal>
    </div>
  );
}

// ─── Check-in Panel (rotating OTP + geo config) ──────────
function CheckinPanel({ eventId }) {
  const [session, setSession] = useState(null);
  const [code, setCode] = useState('');
  const [expiresAt, setExpiresAt] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const intervalRef = useRef(null);

  // Config form
  const [rotationSeconds, setRotationSeconds] = useState(30);
  const [geoRequired, setGeoRequired] = useState(false);
  const [venueLat, setVenueLat] = useState('');
  const [venueLng, setVenueLng] = useState('');
  const [geoRadius, setGeoRadius] = useState(200);

  // Fetch session status
  const fetchSession = useCallback(async () => {
    try {
      const data = await api.get(`/attendance/session/${eventId}`);
      setSession(data.session);
      if (data.session?.isActive) {
        const codeData = await api.get(`/attendance/session/${eventId}/code`);
        setCode(codeData.code);
        setExpiresAt(new Date(codeData.expiresAt));
        setQrCode(codeData.qrCode || '');
      }
    } catch {}
    setLoading(false);
  }, [eventId]);

  useEffect(() => { fetchSession(); }, [fetchSession]);

  // Poll for new code when session is active
  useEffect(() => {
    if (!session?.isActive) {
      clearInterval(intervalRef.current);
      return;
    }

    const poll = async () => {
      try {
        const data = await api.get(`/attendance/session/${eventId}/code`);
        setCode(data.code);
        setExpiresAt(new Date(data.expiresAt));
        setQrCode(data.qrCode || '');
      } catch {}
    };

    intervalRef.current = setInterval(poll, 3000); // poll every 3s
    return () => clearInterval(intervalRef.current);
  }, [session?.isActive, eventId]);

  // Countdown timer
  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / 1000));
      setCountdown(remaining);
    };
    tick();
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, [expiresAt]);

  const handleStart = async () => {
    setStarting(true);
    try {
      const body = {
        eventId,
        rotationSeconds,
        geoRequired,
        geoRadiusMeters: geoRadius,
      };
      if (geoRequired) {
        body.venueLat = parseFloat(venueLat);
        body.venueLng = parseFloat(venueLng);
      }
      const data = await api.post('/attendance/session/start', body);
      setSession(data.session);
      setCode(data.session.currentCode);
      setExpiresAt(new Date(data.session.codeExpiresAt));
    } catch (err) {
      alert(err.message);
    }
    setStarting(false);
  };

  const handleStop = async () => {
    await api.post('/attendance/session/stop', { eventId });
    setSession({ ...session, isActive: false });
    setCode('');
    clearInterval(intervalRef.current);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(
      (pos) => { setVenueLat(pos.coords.latitude.toFixed(6)); setVenueLng(pos.coords.longitude.toFixed(6)); },
      () => alert('Could not get location')
    );
  };

  if (loading) return <div className="flex justify-center py-8"><Spinner /></div>;

  // Active session — show live code
  if (session?.isActive) {
    return (
      <div className="text-center space-y-6">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Current Code</p>
          <p className="text-6xl font-bold text-[var(--color-primary)] font-mono tracking-[0.3em]">{code}</p>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className={`font-mono font-bold ${countdown <= 5 ? 'text-red-400' : 'text-white'}`}>{countdown}s</span>
          <span className="text-gray-500">until rotation</span>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="primary">Every {session.rotationSeconds}s</Badge>
          {session.geoRequired && <Badge variant="accent"><MapPin className="w-3 h-3 mr-0.5" />Geo: {session.geoRadiusMeters}m</Badge>}
        </div>

        <p className="text-xs text-gray-500">Display this code on a screen at the venue. It auto-rotates.</p>

        {qrCode && (
          <div className="flex flex-col items-center gap-2">
            <img src={qrCode} alt="Check-in QR Code" className="w-48 h-48 rounded-xl border border-white/10" />
            <p className="text-[10px] text-gray-500">Students can scan this QR to auto-fill the code</p>
          </div>
        )}

        <Button variant="danger" onClick={handleStop} className="w-full"><Square className="w-4 h-4" /> Stop Check-in</Button>
      </div>
    );
  }

  // No active session — show config form
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">Configure and start a check-in session. The OTP code will rotate automatically.</p>

      <Input label="Rotation Interval (seconds)" type="number" value={rotationSeconds} onChange={e => setRotationSeconds(Math.max(10, parseInt(e.target.value) || 30))} min={10} max={300} />

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={geoRequired} onChange={e => setGeoRequired(e.target.checked)} className="w-4 h-4 rounded border-white/20 bg-[var(--color-bg)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
          <span className="text-sm text-white font-medium">Require geolocation</span>
        </label>
        <p className="text-[10px] text-gray-500 mt-1 ml-7">Students must be physically near the venue to check in</p>
      </div>

      {geoRequired && (
        <div className="space-y-3 pl-7 border-l-2 border-white/5">
          <div className="grid grid-cols-2 gap-2">
            <Input label="Venue Latitude" value={venueLat} onChange={e => setVenueLat(e.target.value)} placeholder="30.3165" required />
            <Input label="Venue Longitude" value={venueLng} onChange={e => setVenueLng(e.target.value)} placeholder="78.0322" required />
          </div>
          <Button variant="ghost" size="sm" onClick={useMyLocation}><MapPin className="w-3.5 h-3.5" /> Use My Current Location</Button>
          <Input label="Radius (meters)" type="number" value={geoRadius} onChange={e => setGeoRadius(parseInt(e.target.value) || 200)} min={50} max={2000} />
        </div>
      )}

      <Button onClick={handleStart} disabled={starting} className="w-full">
        <Radio className="w-4 h-4" /> {starting ? 'Starting...' : 'Start Check-in Session'}
      </Button>
    </div>
  );
}
