import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { PageHeader, Card, Badge, Spinner, EmptyState } from '../components/UI';
import { Calendar, MapPin, Users, Cloud } from 'lucide-react';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events?limit=50').then(d => setEvents(d.events || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="animate-in">
      <PageHeader title="Events" subtitle="Workshops, hackathons, and build sessions" />

      {events.length === 0 ? (
        <EmptyState icon={<Calendar className="w-8 h-8" />} title="No events yet" description="Check back soon for upcoming sessions." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(event => (
            <Link key={event.id} to={`/events/${event.id}`}>
              <Card className="group hover:border-[var(--color-primary)]/30 h-full">
                {event.image && (
                  <div className="aspect-video rounded-lg overflow-hidden mb-3 -mx-5 -mt-5">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={new Date(event.date) > new Date() ? 'primary' : 'default'}>
                    {new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}
                  </Badge>
                  {event.awsLabConfig?.enabled && <Badge variant="accent"><Cloud className="w-3 h-3 mr-1" />AWS Lab</Badge>}
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-[var(--color-primary)] transition-colors mb-1">{event.title}</h3>
                <div className="space-y-1 text-xs text-gray-400">
                  <p className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{event.location}</p>
                  <p className="flex items-center gap-1.5"><Users className="w-3 h-3" />{event._count?.attendances || 0} attended</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
