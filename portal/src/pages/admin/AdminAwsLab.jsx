import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { PageHeader, Card, Badge, Button, Input, Select, Modal, Spinner, EmptyState } from '../../components/UI';
import { Cloud, Power, PowerOff, Users, AlertTriangle, Clock } from 'lucide-react';

export default function AdminAwsLab() {
  const [events, setEvents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEnable, setShowEnable] = useState(null);
  const [form, setForm] = useState({ maxDurationHours: 2, maxSessions: 50, allowedServices: 's3,lambda,dynamodb,sns,sqs,apigateway,logs,cloudwatch' });

  const fetchData = async () => {
    try {
      const [evData, sessData] = await Promise.all([
        api.get('/events?limit=50'),
        api.get('/aws-lab/sessions'),
      ]);
      setEvents(evData.events || []);
      setSessions(sessData.sessions || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleEnable = async (e) => {
    e.preventDefault();
    await api.post(`/aws-lab/events/${showEnable}/enable`, form);
    setShowEnable(null);
    fetchData();
  };

  const handleDisable = async (eventId) => {
    await api.post(`/aws-lab/events/${eventId}/disable`);
    fetchData();
  };

  const handleRevokeAll = async (eventId) => {
    if (!confirm('Revoke all active sessions for this event? Credentials will still work until they expire on AWS side.')) return;
    await api.post(`/aws-lab/events/${eventId}/revoke-all`);
    fetchData();
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="animate-in">
      <PageHeader title="AWS Lab Access" subtitle="Manage temporary AWS credentials for events" />

      {/* Active Sessions */}
      {sessions.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2"><Users className="w-4 h-4" /> Active Sessions ({sessions.length})</h2>
          <div className="space-y-2">
            {sessions.map(s => (
              <Card key={s.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center text-xs font-bold text-[var(--color-accent)]">
                  {s.user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{s.user?.name}</p>
                  <p className="text-[10px] text-gray-500">{s.config?.event?.title}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {new Date(s.expiresAt).toLocaleTimeString()}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Events */}
      <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">Events</h2>
      <div className="space-y-2">
        {events.map(ev => (
          <Card key={ev.id} className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center shrink-0">
              <Cloud className="w-5 h-5 text-[var(--color-accent)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{ev.title}</p>
              <p className="text-xs text-gray-500">{new Date(ev.date).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              {ev.awsLabConfig?.enabled ? (
                <>
                  <Badge variant="success">Lab Active</Badge>
                  <Button size="sm" variant="danger" onClick={() => handleDisable(ev.id)}><PowerOff className="w-3.5 h-3.5" /></Button>
                  <Button size="sm" variant="secondary" onClick={() => handleRevokeAll(ev.id)}>Revoke All</Button>
                </>
              ) : (
                <Button size="sm" variant="secondary" onClick={() => setShowEnable(ev.id)}><Power className="w-3.5 h-3.5" /> Enable Lab</Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Config note */}
      <Card className="mt-6 border-amber-500/20 bg-amber-500/5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-white">AWS Configuration Required</p>
            <p className="text-xs text-gray-400 mt-1">Set <code className="text-amber-400">AWS_LAB_ROLE_ARN</code>, <code className="text-amber-400">AWS_ACCESS_KEY_ID</code>, and <code className="text-amber-400">AWS_SECRET_ACCESS_KEY</code> in your backend <code>.env</code> file. The IAM role must have a trust policy allowing your backend user to assume it.</p>
          </div>
        </div>
      </Card>

      {/* Enable Modal */}
      <Modal open={!!showEnable} onClose={() => setShowEnable(null)} title="Enable AWS Lab Access">
        <form onSubmit={handleEnable} className="space-y-3">
          <Input label="Max Duration (hours)" type="number" value={form.maxDurationHours} onChange={e => setForm({ ...form, maxDurationHours: parseInt(e.target.value) || 2 })} min={1} max={12} />
          <Input label="Max Sessions" type="number" value={form.maxSessions} onChange={e => setForm({ ...form, maxSessions: parseInt(e.target.value) || 50 })} />
          <Input label="Allowed Services (comma-separated)" value={form.allowedServices} onChange={e => setForm({ ...form, allowedServices: e.target.value })} />
          <p className="text-[10px] text-gray-500">Available: s3, lambda, dynamodb, sns, sqs, apigateway, logs, cloudwatch, cloudformation, ecs, ecr, stepfunctions, eventbridge</p>
          <Button type="submit" className="w-full">Enable Lab Access</Button>
        </form>
      </Modal>
    </div>
  );
}
