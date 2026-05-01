import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { PageHeader, StatBox, Spinner } from '../../components/UI';
import { Users, Calendar, ClipboardCheck, Award, Star, UserPlus } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(d => setStats(d.stats)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="animate-in">
      <PageHeader title="Admin Dashboard" subtitle="Overview of your community" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatBox label="Total Users" value={stats?.totalUsers || 0} icon={<Users className="w-5 h-5" />} />
        <StatBox label="Active Users" value={stats?.activeUsers || 0} icon={<Users className="w-5 h-5" />} color="text-emerald-400" />
        <StatBox label="New (30d)" value={stats?.recentSignups || 0} icon={<UserPlus className="w-5 h-5" />} color="text-[var(--color-accent)]" />
        <StatBox label="Events" value={stats?.totalEvents || 0} icon={<Calendar className="w-5 h-5" />} color="text-amber-400" />
        <StatBox label="Attendances" value={stats?.totalAttendances || 0} icon={<ClipboardCheck className="w-5 h-5" />} />
        <StatBox label="Certificates" value={stats?.totalCertificates || 0} icon={<Award className="w-5 h-5" />} color="text-emerald-400" />
        <StatBox label="Points Issued" value={stats?.totalPointsIssued || 0} icon={<Star className="w-5 h-5" />} color="text-amber-400" />
      </div>
    </div>
  );
}
