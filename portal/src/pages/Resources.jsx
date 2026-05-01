import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { PageHeader, Card, Badge, Button, Spinner, EmptyState } from '../components/UI';
import { BookOpen, ExternalLink, Check, Star } from 'lucide-react';

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState('');

  useEffect(() => {
    api.get('/resources?limit=50').then(d => setResources(d.resources || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleComplete = async (id) => {
    setCompleting(id);
    try {
      await api.post(`/resources/${id}/complete`);
      setResources(prev => prev.map(r => r.id === id ? { ...r, completed: true } : r));
    } catch { }
    setCompleting('');
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  const categories = [...new Set(resources.map(r => r.category))];

  return (
    <div className="animate-in">
      <PageHeader title="Resources" subtitle="Learning materials across cloud, AI, and development" />
      {resources.length === 0 ? (
        <EmptyState icon={<BookOpen className="w-8 h-8" />} title="No resources yet" description="Resources will appear here once added by admins." />
      ) : (
        <div className="space-y-6">
          {categories.map(cat => (
            <div key={cat}>
              <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">{cat}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {resources.filter(r => r.category === cat).map(r => (
                  <Card key={r.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-white mb-1">{r.title}</h3>
                        {r.description && <p className="text-xs text-gray-400 line-clamp-2 mb-2">{r.description}</p>}
                        <div className="flex items-center gap-2">
                          {r.pointsReward > 0 && <Badge variant="primary"><Star className="w-3 h-3 mr-0.5" />{r.pointsReward} pts</Badge>}
                          {r.completed && <Badge variant="success"><Check className="w-3 h-3 mr-0.5" />Done</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {r.url && (
                        <a href={r.url} target="_blank" rel="noopener noreferrer">
                          <Button variant="secondary" size="sm"><ExternalLink className="w-3 h-3" /> Open</Button>
                        </a>
                      )}
                      {!r.completed && (
                        <Button variant="ghost" size="sm" onClick={() => handleComplete(r.id)} disabled={completing === r.id}>
                          {completing === r.id ? 'Marking...' : 'Mark Complete'}
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
