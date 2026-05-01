import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { PageHeader, Card, Badge, Spinner, EmptyState } from '../components/UI';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';

export default function Points() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/points/my').then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="animate-in">
      <PageHeader title="Points" subtitle="Your reward points history" action={
        <div className="text-right">
          <p className="text-3xl font-bold text-[var(--color-primary)]">{data?.balance || 0}</p>
          <p className="text-xs text-gray-400">Total Points</p>
        </div>
      } />

      {!data?.transactions?.length ? (
        <EmptyState icon={<Star className="w-8 h-8" />} title="No points yet" description="Attend events, complete resources, and refer friends to earn points." />
      ) : (
        <div className="space-y-2">
          {data.transactions.map(t => (
            <Card key={t.id} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${t.points > 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                {t.points > 0 ? <TrendingUp className="w-5 h-5 text-emerald-400" /> : <TrendingDown className="w-5 h-5 text-red-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{t.reason || t.type}</p>
                <p className="text-xs text-gray-400">{new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <span className={`text-sm font-bold ${t.points > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {t.points > 0 ? '+' : ''}{t.points}
              </span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
