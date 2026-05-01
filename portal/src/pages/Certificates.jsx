import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { PageHeader, Card, Badge, Spinner, EmptyState } from '../components/UI';
import { Award, Copy, Check } from 'lucide-react';

export default function Certificates() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    api.get('/certificates/my').then(d => setCerts(d.certificates || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const copyVerifyLink = (code) => {
    navigator.clipboard.writeText(`${window.location.origin}/verify/${code}`);
    setCopied(code);
    setTimeout(() => setCopied(''), 2000);
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="animate-in">
      <PageHeader title="Certificates" subtitle={`${certs.length} certificates earned`} />
      {certs.length === 0 ? (
        <EmptyState icon={<Award className="w-8 h-8" />} title="No certificates yet" description="Certificates will appear here once issued by admins." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {certs.map(c => (
            <Card key={c.id}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white">{c.title}</h3>
                  {c.description && <p className="text-xs text-gray-400 mt-0.5">{c.description}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="success">{c.type}</Badge>
                    <span className="text-[10px] text-gray-500">{new Date(c.issuedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <code className="text-[10px] text-gray-400 font-mono">{c.verifyCode}</code>
                    <button onClick={() => copyVerifyLink(c.verifyCode)} className="text-gray-500 hover:text-white transition-colors">
                      {copied === c.verifyCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
