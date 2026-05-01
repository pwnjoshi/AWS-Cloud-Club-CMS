import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { PageHeader, Card, Badge, Button, Input, Textarea, Select, Modal, Spinner, EmptyState } from '../../components/UI';
import { Megaphone, Plus, Trash2 } from 'lucide-react';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', priority: 'NORMAL' });

  const fetch = () => {
    api.get('/announcements?limit=50').then(d => setAnnouncements(d.announcements || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/announcements', form);
    setShowCreate(false);
    setForm({ title: '', body: '', priority: 'NORMAL' });
    fetch();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this announcement?')) return;
    await api.delete(`/announcements/${id}`);
    fetch();
  };

  return (
    <div className="animate-in">
      <PageHeader title="Announcements" subtitle="Manage community announcements" action={<Button onClick={() => setShowCreate(true)}><Plus className="w-4 h-4" /> New</Button>} />

      {loading ? <Spinner /> : announcements.length === 0 ? (
        <EmptyState icon={<Megaphone className="w-8 h-8" />} title="No announcements" />
      ) : (
        <div className="space-y-2">
          {announcements.map(a => (
            <Card key={a.id} className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-white">{a.title}</p>
                  <Badge variant={a.priority === 'HIGH' || a.priority === 'URGENT' ? 'danger' : 'default'}>{a.priority}</Badge>
                </div>
                <p className="text-xs text-gray-400">{a.body}</p>
                <p className="text-[10px] text-gray-600 mt-1">{new Date(a.createdAt).toLocaleDateString()}</p>
              </div>
              <Button size="sm" variant="danger" onClick={() => handleDelete(a.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Announcement">
        <form onSubmit={handleCreate} className="space-y-3">
          <Input label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <Textarea label="Body" value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} required />
          <Select label="Priority" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
            <option value="LOW">Low</option>
            <option value="NORMAL">Normal</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </Select>
          <Button type="submit" className="w-full">Publish</Button>
        </form>
      </Modal>
    </div>
  );
}
