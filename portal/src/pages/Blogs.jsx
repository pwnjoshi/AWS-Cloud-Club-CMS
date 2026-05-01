import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { PageHeader, Card, Badge, Button, Input, Select, Modal, Spinner, EmptyState } from '../components/UI';
import { PenTool, ExternalLink, Plus, Clock, Check, X } from 'lucide-react';

export default function Blogs() {
  const [feed, setFeed] = useState([]);
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubmit, setShowSubmit] = useState(false);
  const [form, setForm] = useState({ title: '', url: '', platform: 'other' });
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState('feed');

  const fetchData = () => {
    Promise.all([
      api.get('/blogs'),
      api.get('/blogs/my'),
    ]).then(([f, m]) => { setFeed(f.blogs || []); setMyBlogs(m.blogs || []); }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/blogs', form);
      setMsg('Blog submitted for review!');
      setForm({ title: '', url: '', platform: 'other' });
      setShowSubmit(false);
      fetchData();
    } catch (err) { setMsg(err.message); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="animate-in">
      <PageHeader title="Community Blogs" subtitle="Share your knowledge, earn points and badges" action={<Button onClick={() => setShowSubmit(true)}><Plus className="w-4 h-4" /> Submit Blog</Button>} />

      <div className="flex gap-2 mb-4">
        <Button variant={tab === 'feed' ? 'primary' : 'ghost'} size="sm" onClick={() => setTab('feed')}>Community Feed</Button>
        <Button variant={tab === 'my' ? 'primary' : 'ghost'} size="sm" onClick={() => setTab('my')}>My Submissions</Button>
      </div>

      {tab === 'feed' && (
        feed.length === 0 ? <EmptyState icon={<PenTool className="w-8 h-8" />} title="No blogs yet" description="Be the first to submit a blog post!" /> : (
          <div className="space-y-2">
            {feed.map(b => (
              <Card key={b.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-xs font-bold text-[var(--color-primary)] shrink-0">
                  {b.user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <a href={b.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white hover:text-[var(--color-primary)] transition-colors flex items-center gap-1">
                    {b.title} <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                  <p className="text-xs text-gray-500">by {b.user?.name} · {b.platform} · {new Date(b.reviewedAt).toLocaleDateString()}</p>
                </div>
              </Card>
            ))}
          </div>
        )
      )}

      {tab === 'my' && (
        myBlogs.length === 0 ? <EmptyState icon={<PenTool className="w-8 h-8" />} title="No submissions" description="Submit a blog post to get started." /> : (
          <div className="space-y-2">
            {myBlogs.map(b => (
              <Card key={b.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{b.title}</p>
                  <p className="text-xs text-gray-500">{b.platform} · {new Date(b.createdAt).toLocaleDateString()}</p>
                </div>
                <Badge variant={b.status === 'APPROVED' ? 'success' : b.status === 'REJECTED' ? 'danger' : 'warning'}>
                  {b.status === 'APPROVED' && <Check className="w-3 h-3 mr-0.5" />}
                  {b.status === 'REJECTED' && <X className="w-3 h-3 mr-0.5" />}
                  {b.status === 'PENDING' && <Clock className="w-3 h-3 mr-0.5" />}
                  {b.status}
                </Badge>
                {b.pointsAwarded > 0 && <Badge variant="primary">+{b.pointsAwarded} pts</Badge>}
              </Card>
            ))}
          </div>
        )
      )}

      <Modal open={showSubmit} onClose={() => setShowSubmit(false)} title="Submit Blog Post">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input label="Blog Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <Input label="Blog URL" type="url" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." required />
          <Select label="Platform" value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}>
            <option value="builder-center">AWS Builder Center</option>
            <option value="devto">Dev.to</option>
            <option value="medium">Medium</option>
            <option value="hashnode">Hashnode</option>
            <option value="other">Other</option>
          </Select>
          <p className="text-[10px] text-gray-500">Your blog will be reviewed by an admin. Points and badges are awarded on approval.</p>
          {msg && <p className="text-xs text-red-400">{msg}</p>}
          <Button type="submit" className="w-full">Submit for Review</Button>
        </form>
      </Modal>
    </div>
  );
}
