import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { PageHeader, Card, Badge, Button, Input, Textarea, Spinner, EmptyState } from '../../components/UI';
import { PenTool, Check, X, ExternalLink } from 'lucide-react';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    api.get('/blogs/pending').then(d => setBlogs(d.blogs || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleReview = async (id, status) => {
    const pointsAwarded = status === 'APPROVED' ? 50 : 0;
    await api.put(`/blogs/${id}/review`, { status, pointsAwarded });
    fetch();
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="animate-in">
      <PageHeader title="Blog Reviews" subtitle={`${blogs.length} pending submissions`} />

      {blogs.length === 0 ? (
        <EmptyState icon={<PenTool className="w-8 h-8" />} title="No pending blogs" description="All submissions have been reviewed." />
      ) : (
        <div className="space-y-3">
          {blogs.map(b => (
            <Card key={b.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <a href={b.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white hover:text-[var(--color-primary)] flex items-center gap-1">
                    {b.title} <ExternalLink className="w-3 h-3" />
                  </a>
                  <p className="text-xs text-gray-500 mt-0.5">by {b.user?.name} ({b.user?.email}) · {b.platform}</p>
                  <p className="text-[10px] text-gray-600 mt-0.5">{new Date(b.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="secondary" onClick={() => handleReview(b.id, 'APPROVED')}><Check className="w-3.5 h-3.5" /> Approve</Button>
                  <Button size="sm" variant="danger" onClick={() => handleReview(b.id, 'REJECTED')}><X className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
