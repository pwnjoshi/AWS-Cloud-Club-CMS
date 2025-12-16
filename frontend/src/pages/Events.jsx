import { Calendar, MapPin, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { API_URL } from '../api';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${API_URL}/api/events/`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch events');
                return res.json();
            })
            .then(data => {
                setEvents(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching events:", err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return (
        <main style={{ flex: 1 }}>
            <section style={{
                padding: '8rem 2rem 6rem',
                textAlign: 'center',
                background: 'radial-gradient(circle at top, #1A2332 0%, #0F1520 70%)',
                overflow: 'hidden'
            }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem', color: 'white' }}>Upcoming Events</h1>
                <p style={{ maxWidth: '600px', margin: '0 auto', color: '#9CA3AF', fontSize: '1.2rem', lineHeight: '1.6' }}>
                    Join us for workshops, hackathons, and speaker sessions designed to level up your cloud journey.
                </p>
            </section>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
                {loading && <div style={{ textAlign: 'center', color: 'white' }}>Loading events...</div>}

                {error && (
                    <div style={{ textAlign: 'center', color: '#EF4444', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <AlertCircle size={48} />
                        <p>Unable to load events at the moment.</p>
                    </div>
                )}

                {!loading && !error && events.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '4rem' }}>
                        <Calendar size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <h3>No upcoming events scheduled.</h3>
                        <p>Stay tuned for updates!</p>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </div>
        </main>
    );
}

function EventCard({ event }) {
    // Format date/time
    const dateObj = new Date(event.start_time);
    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Determine type color (default blue)
    const isHackathon = event.event_type === 'HACKATHON';
    const typeColor = isHackathon ? '#FF9900' : '#3B82F6';
    const typeBg = isHackathon ? 'rgba(255, 153, 0, 0.1)' : 'rgba(0, 115, 187, 0.1)';
    const typeBorder = isHackathon ? 'rgba(255, 153, 0, 0.2)' : 'rgba(0, 115, 187, 0.2)';

    // Placeholder image if none provided (backend doesn't have image field yet, so using logic or random)
    // Note: Backend model currently doesn't have 'image', so we'll use a placeholder or add it later.
    // For now, let's use a standard AWS placeholder.
    const image = "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600";

    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#1E293B', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ height: '220px', background: `url(${image}) center/cover` }}></div>
            <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{
                    alignSelf: 'start',
                    background: typeBg,
                    color: typeColor,
                    fontSize: '0.8rem', fontWeight: 'bold', padding: '0.4rem 0.8rem', borderRadius: '50px', marginBottom: '1rem', border: `1px solid ${typeBorder}`
                }}>
                    {event.event_type}
                </span>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'white' }}>{event.title}</h3>

                <div style={{ display: 'flex', gap: '1.5rem', color: '#9CA3AF', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={18} /> {dateStr}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={18} /> {timeStr}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9CA3AF', fontSize: '0.95rem', marginBottom: '2rem' }}>
                    <MapPin size={18} /> {event.location}
                </div>

                <div style={{ marginTop: 'auto' }}>
                    <p style={{ color: '#D1D5DB', fontSize: '0.9rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {event.description}
                    </p>
                    <button className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                        Register Now <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    )
}
