import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { PageHeader, StatBox, Card, Badge, Spinner } from '../../components/UI';
import { Users, Calendar, ClipboardCheck, Award, Star, UserPlus, Medal, PenTool, BookOpen, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  const s = data?.stats || {};
  const c = data?.charts || {};

  return (
    <div className="animate-in">
      <PageHeader title="Admin Dashboard" subtitle="Community analytics and overview" />

      {/* Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatBox label="Total Users" value={s.totalUsers || 0} icon={<Users className="w-5 h-5" />} />
        <StatBox label="Active (30d)" value={s.activeInLast30Days || 0} icon={<Activity className="w-5 h-5" />} color="text-emerald-400" />
        <StatBox label="New (30d)" value={s.recentSignups || 0} icon={<UserPlus className="w-5 h-5" />} color="text-[var(--color-accent)]" />
        <StatBox label="Events" value={s.totalEvents || 0} icon={<Calendar className="w-5 h-5" />} color="text-amber-400" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatBox label="Attendances" value={s.totalAttendances || 0} icon={<ClipboardCheck className="w-5 h-5" />} />
        <StatBox label="Certificates" value={s.totalCertificates || 0} icon={<Award className="w-5 h-5" />} color="text-emerald-400" />
        <StatBox label="Badges Earned" value={s.totalBadgesEarned || 0} icon={<Medal className="w-5 h-5" />} color="text-amber-400" />
        <StatBox label="Points Issued" value={s.totalPointsIssued || 0} icon={<Star className="w-5 h-5" />} color="text-[var(--color-primary)]" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatBox label="Blogs Approved" value={s.totalBlogsApproved || 0} icon={<PenTool className="w-5 h-5" />} color="text-[var(--color-accent)]" />
        <StatBox label="Resources" value={s.totalResources || 0} icon={<BookOpen className="w-5 h-5" />} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Signups Chart (simple bar) */}
        <Card>
          <h3 className="text-sm font-bold text-white mb-4">Signups (Last 7 Days)</h3>
          <div className="flex items-end gap-1 h-32">
            {c.signupsByDay?.map((d, i) => {
              const max = Math.max(...c.signupsByDay.map(x => x.count), 1);
              const height = Math.max(4, (d.count / max) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-gray-400">{d.count}</span>
                  <div className="w-full bg-[var(--color-primary)]/20 rounded-t" style={{ height: `${height}%` }}>
                    <div className="w-full h-full bg-[var(--color-primary)] rounded-t opacity-80" />
                  </div>
                  <span className="text-[9px] text-gray-500">{d.date.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Attendance by Event */}
        <Card>
          <h3 className="text-sm font-bold text-white mb-4">Attendance by Event</h3>
          <div className="space-y-2">
            {c.attendanceByEvent?.map((e, i) => {
              const max = Math.max(...c.attendanceByEvent.map(x => x.attendees), 1);
              const width = Math.max(5, (e.attendees / max) * 100);
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-gray-300 truncate max-w-[70%]">{e.title}</span>
                    <span className="text-gray-500">{e.attendees}</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--color-accent)] rounded-full" style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
            {(!c.attendanceByEvent || c.attendanceByEvent.length === 0) && (
              <p className="text-xs text-gray-500">No events yet</p>
            )}
          </div>
        </Card>

        {/* Top Users */}
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-bold text-white mb-4">Top Builders by Points</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {c.topUsers?.map((u, i) => (
              <div key={i} className="flex flex-col items-center gap-1 min-w-[80px]">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-amber-500/20 text-amber-400' : i === 1 ? 'bg-gray-400/20 text-gray-300' : 'bg-orange-500/20 text-orange-400'}`}>
                  {i + 1}
                </div>
                <span className="text-xs text-white font-medium text-center truncate w-full">{u.name}</span>
                <Badge variant="primary">{u.points} pts</Badge>
              </div>
            ))}
            {(!c.topUsers || c.topUsers.length === 0) && (
              <p className="text-xs text-gray-500">No points data yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
