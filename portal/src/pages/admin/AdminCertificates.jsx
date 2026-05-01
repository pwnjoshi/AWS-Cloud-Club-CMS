import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { PageHeader, Card, Button, Input, Select, Textarea, Modal, Spinner } from '../../components/UI';
import { Award, Plus } from 'lucide-react';

export default function AdminCertificates() {
  const [users, setUsers] = useState([]);
  const [showIssue, setShowIssue] = useState(false);
  const [form, setForm] = useState({ userId: '', title: '', description: '', type: 'PARTICIPATION', pointsAwarded: 0 });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/admin/users?limit=200').then(d => setUsers(d.users || [])).catch(() => {});
  }, []);

  const handleIssue = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/certificates', form);
      setMsg('Certificate issued successfully!');
      setForm({ userId: '', title: '', description: '', type: 'PARTICIPATION', pointsAwarded: 0 });
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div className="animate-in">
      <PageHeader title="Certificates" subtitle="Issue and manage certificates" action={<Button onClick={() => setShowIssue(true)}><Plus className="w-4 h-4" /> Issue Certificate</Button>} />

      <Card>
        <p className="text-sm text-gray-400">Use the "Issue Certificate" button to award certificates to members. Certificates include a unique verification code.</p>
      </Card>

      <Modal open={showIssue} onClose={() => setShowIssue(false)} title="Issue Certificate">
        <form onSubmit={handleIssue} className="space-y-3">
          <Select label="Member" value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })} required>
            <option value="">Select member...</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
          </Select>
          <Input label="Certificate Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <Textarea label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <Select label="Type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="PARTICIPATION">Participation</option>
            <option value="ACHIEVEMENT">Achievement</option>
            <option value="AWS_CERT">AWS Certification</option>
          </Select>
          <Input label="Points to Award" type="number" value={form.pointsAwarded} onChange={e => setForm({ ...form, pointsAwarded: parseInt(e.target.value) || 0 })} />
          {msg && <p className="text-xs text-gray-400">{msg}</p>}
          <Button type="submit" className="w-full">Issue Certificate</Button>
        </form>
      </Modal>
    </div>
  );
}
