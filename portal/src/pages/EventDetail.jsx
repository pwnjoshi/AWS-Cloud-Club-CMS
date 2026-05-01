import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { PageHeader, Card, Badge, Button, Input, Spinner } from '../components/UI';
import { Calendar, MapPin, Star, ExternalLink, Cloud, Copy, Check, AlertTriangle, Clock } from 'lucide-react';

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [attended, setAttended] = useState(false);
  const [labStatus, setLabStatus] = useState(null);
  const [labCreds, setLabCreds] = useState(null);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [labLoading, setLabLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [copied, setCopied] = useState('');

  useEffect(() => {
    Promise.all([
      api.get(`/events/${id}`),
      api.get(`/aws-lab/events/${id}/status`).catch(() => ({ available: false })),
    ]).then(([eventData, lab]) => {
      setEvent(eventData.event);
      setAttended(eventData.attended);
      setLabStatus(lab);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleCheckin = async (e) => {
    e.preventDefault();
    setCheckinLoading(true);
    setMsg('');
    try {
      await api.post('/attendance/checkin', { eventId: id, code: otpCode });
      setAttended(true);
      setMsg('Checked in successfully! Points awarded.');
    } catch (err) {
      setMsg(err.message);
    } finally {
      setCheckinLoading(false);
    }
  };

  const handleRequestLab = async () => {
    setLabLoading(true);
    try {
      const data = await api.post(`/aws-lab/events/${id}/request`);
      setLabCreds(data);
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLabLoading(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (!event) return <p className="text-gray-400 text-center py-20">Event not found</p>;

  return (
    <div className="animate-in">
      <PageHeader title={event.title} subtitle={new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {event.image && (
            <div className="aspect-video rounded-xl overflow-hidden">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
            </div>
          )}

          <Card>
            <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">About</h2>
            <p className="text-sm text-gray-400 leading-relaxed">{event.description || 'No description available.'}</p>
          </Card>

          {/* AWS Lab Credentials (if received) */}
          {labCreds && (
            <Card className="border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5">
              <div className="flex items-center gap-2 mb-4">
                <Cloud className="w-5 h-5 text-[var(--color-accent)]" />
                <h2 className="text-sm font-bold text-white">AWS Lab Credentials</h2>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-4 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-300">{labCreds.warning}</p>
              </div>
              <div className="space-y-3">
                <CredField label="Access Key ID" value={labCreds.credentials.accessKeyId} copied={copied} onCopy={copyToClipboard} />
                <CredField label="Secret Access Key" value={labCreds.credentials.secretAccessKey} copied={copied} onCopy={copyToClipboard} />
                <CredField label="Session Token" value={labCreds.credentials.sessionToken} copied={copied} onCopy={copyToClipboard} truncate />
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  Expires: {new Date(labCreds.credentials.expiresAt).toLocaleString()}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {labCreds.allowedServices?.map(s => <Badge key={s} variant="accent">{s}</Badge>)}
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          {/* Event Info */}
          <Card>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-300"><Calendar className="w-4 h-4 text-[var(--color-primary)]" />{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
              <div className="flex items-center gap-2 text-gray-300"><MapPin className="w-4 h-4 text-[var(--color-primary)]" />{event.location}</div>
              <div className="flex items-center gap-2 text-gray-300"><Star className="w-4 h-4 text-[var(--color-primary)]" />{event.pointsReward} points for attendance</div>
            </div>
            {event.registrationLink && (
              <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm font-semibold text-white hover:bg-white/10 transition-colors">
                Register <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </Card>

          {/* Check-in */}
          <Card>
            <h3 className="text-sm font-bold text-white mb-3">Event Check-in</h3>
            {attended ? (
              <div className="flex items-center gap-2 text-emerald-400 text-sm"><Check className="w-4 h-4" /> You've checked in</div>
            ) : (
              <form onSubmit={handleCheckin} className="space-y-3">
                <Input placeholder="Enter 6-digit OTP" value={otpCode} onChange={e => setOtpCode(e.target.value)} required maxLength={6} />
                <Button type="submit" disabled={checkinLoading} className="w-full" size="sm">{checkinLoading ? 'Checking in...' : 'Check In'}</Button>
              </form>
            )}
            {msg && <p className="text-xs text-gray-400 mt-2">{msg}</p>}
          </Card>

          {/* AWS Lab Access */}
          {labStatus?.available && (
            <Card className="border-[var(--color-accent)]/20">
              <div className="flex items-center gap-2 mb-3">
                <Cloud className="w-4 h-4 text-[var(--color-accent)]" />
                <h3 className="text-sm font-bold text-white">AWS Lab Access</h3>
              </div>
              <div className="text-xs text-gray-400 space-y-1 mb-3">
                <p>Duration: {labStatus.maxDurationHours}h</p>
                <p>Spots left: {labStatus.spotsLeft} / {labStatus.maxSessions}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {labStatus.allowedServices?.map(s => <Badge key={s} variant="accent">{s}</Badge>)}
                </div>
              </div>
              {labStatus.hasActiveSession ? (
                <div className="text-xs text-amber-400 flex items-center gap-1"><Clock className="w-3 h-3" /> Active session expires {new Date(labStatus.sessionExpiresAt).toLocaleTimeString()}</div>
              ) : labCreds ? (
                <div className="text-xs text-emerald-400">Credentials issued — see above</div>
              ) : (
                <Button onClick={handleRequestLab} disabled={labLoading} variant="secondary" size="sm" className="w-full">
                  <Cloud className="w-3.5 h-3.5" /> {labLoading ? 'Generating...' : 'Get AWS Access'}
                </Button>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function CredField({ label, value, copied, onCopy, truncate }) {
  const displayValue = truncate && value?.length > 40 ? value.slice(0, 20) + '...' + value.slice(-20) : value;
  return (
    <div>
      <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">{label}</p>
      <div className="flex items-center gap-2 bg-[var(--color-bg)] rounded-lg px-3 py-2 border border-white/5">
        <code className="text-xs text-white flex-1 break-all font-mono">{displayValue}</code>
        <button onClick={() => onCopy(value, label)} className="shrink-0 text-gray-400 hover:text-white transition-colors">
          {copied === label ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}
