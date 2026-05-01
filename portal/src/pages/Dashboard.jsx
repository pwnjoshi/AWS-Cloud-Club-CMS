import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { PageHeader, Card, StatBox, Badge, Spinner } from '../components/UI';
import { Star, Calendar, Award, ClipboardCheck, ArrowRight, Megaphone } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/users/profile'),
      api.get('/points/my'),
      api.get('/attendance/my'),
      api.get('/certificates/my'),
      api.get('/announcements?limit=3'),
    ]).then(([profile, points, attendance, certs, ann]) => {
      setData({ profile, points, attendance, certs });
      setAnnouncements(ann.announcements || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  const balance = data?.points?.balance || 0;
  const attended = data?.attendance?.attendances?.length || 0;
  const certCount = data?.certs?.certificates?.length || 0;

  return (
    <div className="animate-in">
      <PageHeader title={`Welcome, ${user?.name?.split(' ')[0]}`} subtitle="Your builder dashboard" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        <StatBox label="Points" value={balance} icon={<Star className="w-5 h-5" />} />
        <StatBox label="Events Attended" value={attended} icon={<Calendar className="w-5 h-5" />} color="text-[var(--color-accent)]" />
        <StatBox label="Certificates" value={certCount} icon={<Award className="w-5 h-5" />} color="text-emerald-400" />
        <StatBox label="Referral Code" value={user?.referralCode} icon={<ClipboardCheck className="w-5 h-5" />} color="text-amber-400" />
      </div>

      {/* Announcements */}
      {announcements.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2"><Megaphone className="w-4 h-4" /> Announcements</h2>
          <div className="space-y-2">
            {announcements.map(a => (
              <Card key={a.id} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.priority === 'HIGH' || a.priority === 'URGENT' ? 'bg-red-400' : 'bg-[var(--color-primary)]'}`} />
                <div>
                  <p className="text-sm font-semibold text-white">{a.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{a.body}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <QuickLink to="/events" label="Browse Events" desc="Find upcoming workshops and sessions" />
        <QuickLink to="/resources" label="Learning Resources" desc="Cloud, AI, and full-stack materials" />
        <QuickLink to="/leaderboard" label="Leaderboard" desc="See top builders by points" />
      </div>
    </div>
  );
}

function QuickLink({ to, label, desc }) {
  return (
    <Link to={to}>
      <Card className="group hover:border-[var(--color-primary)]/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white group-hover:text-[var(--color-primary)] transition-colors">{label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all" />
        </div>
      </Card>
    </Link>
  );
}
