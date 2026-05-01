import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { PageHeader, Card, Badge as BadgeUI, Spinner, EmptyState } from '../components/UI';
import { Medal } from 'lucide-react';

export default function Badges() {
  const [allBadges, setAllBadges] = useState([]);
  const [myBadges, setMyBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/badges'),
      api.get('/badges/my'),
    ]).then(([all, my]) => {
      setAllBadges(all.badges || []);
      setMyBadges(my.badges || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  const earnedIds = new Set(myBadges.map(b => b.badgeId));

  return (
    <div className="animate-in">
      <PageHeader title="Badges" subtitle={`${myBadges.length} of ${allBadges.length} earned`} />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {allBadges.map(badge => {
          const earned = earnedIds.has(badge.id);
          const userBadge = myBadges.find(b => b.badgeId === badge.id);
          return (
            <Card key={badge.id} className={`text-center ${earned ? 'border-[var(--color-primary)]/30' : 'opacity-50'}`}>
              <div className="text-4xl mb-2">{badge.icon}</div>
              <h3 className="text-sm font-bold text-white mb-0.5">{badge.name}</h3>
              <p className="text-[10px] text-gray-400 mb-2">{badge.description}</p>
              {earned ? (
                <BadgeUI variant="success">Earned {new Date(userBadge.earnedAt).toLocaleDateString()}</BadgeUI>
              ) : (
                <BadgeUI>Locked</BadgeUI>
              )}
              {badge.pointsReward > 0 && <p className="text-[10px] text-[var(--color-primary)] mt-1">+{badge.pointsReward} pts</p>}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
