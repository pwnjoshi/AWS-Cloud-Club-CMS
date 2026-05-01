import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { PageHeader, Card, Badge, Spinner, EmptyState } from '../../components/UI';
import { ClipboardCheck } from 'lucide-react';

export default function AdminAudit() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/audit?limit=100').then(d => setLogs(d.logs || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="animate-in">
      <PageHeader title="Audit Log" subtitle="All admin actions are recorded here" />

      {logs.length === 0 ? (
        <EmptyState icon={<ClipboardCheck className="w-8 h-8" />} title="No audit entries" />
      ) : (
        <div className="space-y-2">
          {logs.map(log => (
            <Card key={log.id} className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="primary">{log.action}</Badge>
                  {log.targetType && <Badge>{log.targetType}</Badge>}
                  <span className="text-[10px] text-gray-500">{new Date(log.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">by {log.actor?.name || 'Unknown'}</p>
                {log.details && <p className="text-[10px] text-gray-600 mt-0.5 font-mono truncate">{log.details}</p>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
