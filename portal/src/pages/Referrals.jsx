import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { PageHeader, Card, Badge, Button, Spinner, EmptyState } from '../components/UI';
import { Users, Copy, Check } from 'lucide-react';

export default function Referrals() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get('/referrals/my').then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const referralLink = `${window.location.origin}/register?ref=${user?.referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="animate-in">
      <PageHeader title="Referrals" subtitle="Invite friends and earn 30 points per referral" />

      <Card className="mb-6">
        <h3 className="text-sm font-bold text-white mb-2">Your Referral Link</h3>
        <div className="flex items-center gap-2 bg-[var(--color-bg)] rounded-lg px-3 py-2.5 border border-white/5">
          <code className="text-xs text-gray-300 flex-1 truncate font-mono">{referralLink}</code>
          <button onClick={copyLink} className="shrink-0 text-gray-400 hover:text-white transition-colors">
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Points are credited after the referred person attends their first event.</p>
        {data?.stats && (
          <div className="flex gap-4 mt-4 text-center">
            <div><p className="text-lg font-bold text-white">{data.stats.total}</p><p className="text-[10px] text-gray-400">Total</p></div>
            <div><p className="text-lg font-bold text-emerald-400">{data.stats.credited}</p><p className="text-[10px] text-gray-400">Credited</p></div>
            <div><p className="text-lg font-bold text-amber-400">{data.stats.pending}</p><p className="text-[10px] text-gray-400">Pending</p></div>
          </div>
        )}
      </Card>

      {!data?.referrals?.length ? (
        <EmptyState icon={<Users className="w-8 h-8" />} title="No referrals yet" description="Share your link to start earning points." />
      ) : (
        <div className="space-y-2">
          {data.referrals.map(r => (
            <Card key={r.id} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-gray-300">
                {r.referredUser?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{r.referredUser?.name}</p>
                <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
              <Badge variant={r.status === 'CREDITED' ? 'success' : 'warning'}>{r.status}</Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
