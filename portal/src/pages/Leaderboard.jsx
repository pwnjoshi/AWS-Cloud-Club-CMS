import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { PageHeader, Card, Spinner, EmptyState } from '../components/UI';
import { Trophy, Medal } from 'lucide-react';

export default function Leaderboard() {
  const { user } = useAuth();
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/leaderboard').then(d => setBoard(d.leaderboard || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  const rankColors = ['text-amber-400', 'text-gray-300', 'text-orange-400'];

  return (
    <div className="animate-in">
      <PageHeader title="Leaderboard" subtitle="Top builders by points" />
      {board.length === 0 ? (
        <EmptyState icon={<Trophy className="w-8 h-8" />} title="No rankings yet" description="Start earning points to appear on the leaderboard." />
      ) : (
        <div className="space-y-2">
          {board.map((entry, i) => (
            <Card key={entry.userId} className={`flex items-center gap-4 ${entry.userId === user?.id ? 'border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5' : ''}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-bold text-lg ${i < 3 ? rankColors[i] : 'text-gray-500'}`}>
                {i < 3 ? <Medal className="w-6 h-6" /> : entry.rank}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{entry.name} {entry.userId === user?.id && <span className="text-xs text-[var(--color-primary)]">(You)</span>}</p>
              </div>
              <span className="text-sm font-bold text-[var(--color-primary)]">{entry.points} pts</span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
