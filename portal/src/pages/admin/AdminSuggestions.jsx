import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { PageHeader, Card, Badge, Button, Input, Textarea, Spinner, EmptyState } from '../../components/UI';
import { Lightbulb, Check, X, Star } from 'lucide-react';

export default function AdminSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = () => {
    api.get('/suggestions/pending').then(d => setSuggestions(d.suggestions || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchSuggestions(); }, []);

  const handleReview = async (id, status, pointsAwarded) => {
    const adminNote = status === 'APPROVED' ? 'Great idea! Points awarded.' : '';
    await api.put(`/suggestions/${id}/review`, { status, adminNote, pointsAwarded });
    fetchSuggestions();
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="animate-in">
      <PageHeader title="Event Suggestions" subtitle={`${suggestions.length} pending`} />

      {suggestions.length === 0 ? (
        <EmptyState icon={<Lightbulb className="w-8 h-8" />} title="No pending suggestions" description="All suggestions have been reviewed." />
      ) : (
        <div className="space-y-3">
          {suggestions.map(s => (
            <Card key={s.id}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white">{s.title}</h3>
                  <p className="text-xs text-gray-500">by {s.user?.name} ({s.user?.email}) · {new Date(s.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-3">{s.description}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => handleReview(s.id, 'APPROVED', 25)}>
                  <Check className="w-3.5 h-3.5" /> Approve (+25 pts)
                </Button>
                <Button size="sm" variant="secondary" onClick={() => handleReview(s.id, 'APPROVED', 50)}>
                  <Star className="w-3.5 h-3.5" /> Approve (+50 pts)
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleReview(s.id, 'REJECTED', 0)}>
                  <X className="w-3.5 h-3.5" /> Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
