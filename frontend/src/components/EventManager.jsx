import { useState, useEffect } from 'react';
import { authenticatedFetch } from '../api';
import { Plus, Edit2, Trash2, Calendar, MapPin, Clock } from 'lucide-react';
import EventWizard from './EventWizard';

export default function EventManager() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('list'); // list, create, edit
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const res = await authenticatedFetch('/api/events/');
            if (res.ok) {
                setEvents(await res.json());
            }
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            const res = await authenticatedFetch(`/api/events/${id}/`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setEvents(events.filter(e => e.id !== id));
            } else {
                alert("Failed to delete event.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateSuccess = () => {
        fetchEvents();
        setView('list');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    if (view === 'create') {
        return <EventWizard onCancel={() => setView('list')} onSuccess={handleCreateSuccess} />;
    }

    if (view === 'edit' && selectedEvent) {
        return <EventWizard onCancel={() => setView('list')} onSuccess={handleCreateSuccess} initialData={selectedEvent} />;
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Manage Events</h2>
                <button
                    onClick={() => setView('create')}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={20} /> Create Event
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#9CA3AF' }}>Loading events...</div>
            ) : events.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <p style={{ color: '#9CA3AF', marginBottom: '1rem' }}>No events found.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {events.map(event => (
                        <div key={event.id} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'white' }}>{event.title}</h3>
                                <div style={{ display: 'flex', gap: '1.5rem', color: '#9CA3AF', fontSize: '0.9rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Calendar size={16} />
                                        {formatDate(event.start_time)}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <MapPin size={16} />
                                        {event.location || 'TBD'}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Clock size={16} />
                                        {event.event_type}
                                    </div>
                                </div>
                                {event.registration_link && (
                                    <a
                                        href={event.registration_link.startsWith('http') ? event.registration_link : `https://${event.registration_link}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--aws-smile-orange)', fontSize: '0.9rem', textDecoration: 'none', fontWeight: '500' }}
                                    >
                                        Register Here <Edit2 size={12} style={{ opacity: 0 }} /> {/* Spacer */}
                                    </a>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button
                                    onClick={() => { setSelectedEvent(event); setView('edit'); }}
                                    style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA', border: 'none', padding: '0.6rem', borderRadius: '6px', cursor: 'pointer' }}
                                    title="Edit"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(event.id)}
                                    style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#F87171', border: 'none', padding: '0.6rem', borderRadius: '6px', cursor: 'pointer' }}
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
