import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { PageHeader, Card, Badge, Button, Spinner, EmptyState } from '../components/UI';
import { Gift, Star } from 'lucide-react';

export default function Rewards() {
  const [rewards, setRewards] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/rewards'),
      api.get('/points/my'),
    ]).then(([r, p]) => {
      setRewards(r.rewards || []);
      setBalance(p.balance || 0);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleRedeem = async (rewardId) => {
    setRedeeming(rewardId);
    try {
      await api.post('/rewards/redeem', { rewardId });
      const p = await api.get('/points/my');
      setBalance(p.balance || 0);
      alert('Reward redeemed successfully!');
    } catch (err) {
      alert(err.message);
    }
    setRedeeming('');
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="animate-in">
      <PageHeader title="Rewards Store" subtitle="Redeem your points for rewards" action={
        <div className="flex items-center gap-2 text-[var(--color-primary)]">
          <Star className="w-5 h-5" />
          <span className="text-xl font-bold">{balance}</span>
          <span className="text-xs text-gray-400">pts</span>
        </div>
      } />

      {rewards.length === 0 ? (
        <EmptyState icon={<Gift className="w-8 h-8" />} title="No rewards available" description="Rewards will be added soon. Keep earning points!" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map(r => (
            <Card key={r.id}>
              <h3 className="text-sm font-bold text-white mb-1">{r.title}</h3>
              {r.description && <p className="text-xs text-gray-400 mb-3">{r.description}</p>}
              <div className="flex items-center justify-between">
                <Badge variant="primary"><Star className="w-3 h-3 mr-0.5" />{r.pointsCost} pts</Badge>
                <Button size="sm" onClick={() => handleRedeem(r.id)} disabled={balance < r.pointsCost || redeeming === r.id}>
                  {redeeming === r.id ? 'Redeeming...' : 'Redeem'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
