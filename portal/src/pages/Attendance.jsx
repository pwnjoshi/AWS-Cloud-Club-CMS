import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { PageHeader, Card, Badge, Spinner, EmptyState } from '../components/UI';
import { ClipboardCheck, Calendar } from 'lucide-react';

export default function Attendance() {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/attendance/my').then(d => setAttendances(d.attendances || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="animate-in">
      <PageHeader title="Attendance" subtitle={`${attendances.length} events attended`} />
      {attendances.length === 0 ? (
        <EmptyState icon={<ClipboardCheck className="w-8 h-8" />} title="No attendance yet" description="Check in at events using the OTP code to track your attendance." />
      ) : (
        <div className="space-y-2">
          {attendances.map(a => (
            <Card key={a.id} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{a.event?.title}</p>
                <p className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <Badge variant={a.method === 'OTP' ? 'primary' : 'default'}>{a.method}</Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
