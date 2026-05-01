import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { PageHeader, Card, Badge, Button, Textarea, Select, Modal, Spinner, EmptyState } from '../../components/UI';
import { HelpCircle, MessageSquare } from 'lucide-react';

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyModal, setReplyModal] = useState(null);
  const [reply, setReply] = useState('');
  const [status, setStatus] = useState('RESOLVED');
  const [filter, setFilter] = useState('');

  const fetchTickets = () => {
    const q = filter ? `?status=${filter}` : '';
    api.get(`/support/all${q}`).then(d => setTickets(d.tickets || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchTickets(); }, [filter]);

  const handleReply = async () => {
    await api.put(`/support/${replyModal.id}/reply`, { adminReply: reply, status });
    setReplyModal(null);
    setReply('');
    fetchTickets();
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  const statusVariant = { OPEN: 'warning', IN_PROGRESS: 'accent', RESOLVED: 'success', CLOSED: 'default' };

  return (
    <div className="animate-in">
      <PageHeader title="Support Tickets" subtitle={`${tickets.length} tickets`} />

      <div className="flex gap-2 mb-4">
        {['', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map(s => (
          <Button key={s} size="sm" variant={filter === s ? 'primary' : 'ghost'} onClick={() => setFilter(s)}>
            {s || 'All'}
          </Button>
        ))}
      </div>

      {tickets.length === 0 ? (
        <EmptyState icon={<HelpCircle className="w-8 h-8" />} title="No tickets" />
      ) : (
        <div className="space-y-2">
          {tickets.map(t => (
            <Card key={t.id} className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-white">{t.subject}</p>
                  <Badge variant={statusVariant[t.status]}>{t.status}</Badge>
                  <Badge>{t.category}</Badge>
                </div>
                <p className="text-xs text-gray-500 mb-1">by {t.user?.name} ({t.user?.email}) · {new Date(t.createdAt).toLocaleDateString()}</p>
                <p className="text-xs text-gray-400">{t.message}</p>
                {t.adminReply && <p className="text-xs text-emerald-400 mt-1 italic">Reply: {t.adminReply}</p>}
              </div>
              {!t.adminReply && (
                <Button size="sm" variant="secondary" onClick={() => { setReplyModal(t); setReply(''); setStatus('RESOLVED'); }}>
                  <MessageSquare className="w-3.5 h-3.5" /> Reply
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!replyModal} onClose={() => setReplyModal(null)} title={`Reply to: ${replyModal?.subject}`}>
        <div className="space-y-3">
          <div className="bg-white/5 rounded-lg p-3 text-xs text-gray-400">{replyModal?.message}</div>
          <Textarea label="Your Reply" value={reply} onChange={e => setReply(e.target.value)} required />
          <Select label="Set Status" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="RESOLVED">Resolved</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CLOSED">Closed</option>
          </Select>
          <Button onClick={handleReply} disabled={!reply} className="w-full">Send Reply</Button>
        </div>
      </Modal>
    </div>
  );
}
