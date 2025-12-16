import { Calendar, MapPin, Clock, ArrowRight, AlertCircle, X, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { API_URL } from '../api';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                // Using API_URL directly from imports, matching existing pattern
                const response = await fetch(`${API_URL}/api/events/`);
                if (!response.ok) throw new Error('Failed to fetch events');

                const data = await response.json();

                // ✅ Empty array is VALID
                setEvents(data);
                setError(null);
            } catch (err) {
                console.error("Failed to load events:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
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
                        <h3>No upcoming events yet.</h3>
                        <p>Stay tuned 🚀</p>
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
    const [showModal, setShowModal] = useState(false);

    // Format date/time
    const dateObj = new Date(event.start_time);
    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Determine type color (default blue)
    const isHackathon = event.event_type === 'HACKATHON';
    const typeColor = isHackathon ? '#FF9900' : '#3B82F6';
    const typeBg = isHackathon ? 'rgba(255, 153, 0, 0.1)' : 'rgba(0, 115, 187, 0.1)';
    const typeBorder = isHackathon ? 'rgba(255, 153, 0, 0.2)' : 'rgba(0, 115, 187, 0.2)';

    // Placeholder image
    const image = "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600";

    return (
        <>
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
                    {/* Location Hidden on card, shown in details */}

                    <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
                        {/* Description Hidden */}
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn-secondary"
                            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}
                        >
                            <Info size={18} /> View Details
                        </button>

                        {event.registration_link ? (
                            <a
                                href={event.registration_link.startsWith('http') ? event.registration_link : `https://${event.registration_link}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary"
                                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
                            >
                                Register Now <ArrowRight size={18} />
                            </a>
                        ) : (
                            <button disabled className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: 0.5, cursor: 'not-allowed' }}>
                                Registration Closed
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Details Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }} onClick={() => setShowModal(false)}>
                    <div style={{
                        background: '#1E293B', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)',
                        width: '90%', maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto', position: 'relative',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }} onClick={e => e.stopPropagation()}>

                        <button
                            onClick={() => setShowModal(false)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>

                        <div style={{ height: '200px', background: `url(${image}) center/cover` }}></div>

                        <div style={{ padding: '2rem' }}>
                            <span style={{
                                display: 'inline-block',
                                background: typeBg,
                                color: typeColor,
                                fontSize: '0.8rem', fontWeight: 'bold', padding: '0.4rem 0.8rem', borderRadius: '50px', marginBottom: '1rem', border: `1px solid ${typeBorder}`
                            }}>
                                {event.event_type}
                            </span>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'white' }}>{event.title}</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
                                <div>
                                    <div style={{ color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Date & Time</div>
                                    <div style={{ color: 'white', fontWeight: '500' }}>{dateStr} | {timeStr}</div>
                                </div>
                                <div>
                                    <div style={{ color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Location</div>
                                    <div style={{ color: 'white', fontWeight: '500' }}>{event.location}</div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>About this Event</h4>
                                <p style={{ color: '#D1D5DB', lineHeight: '1.7' }}>
                                    {event.description}
                                </p>
                            </div>

                            {event.registration_link ? (
                                <a
                                    href={event.registration_link.startsWith('http') ? event.registration_link : `https://${event.registration_link}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary"
                                    style={{
                                        width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', padding: '1rem',
                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                    }}
                                >
                                    Register Now <ArrowRight size={20} style={{ flexShrink: 0 }} />
                                </a>
                            ) : (
                                <button disabled className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: 0.5, cursor: 'not-allowed', padding: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    Registration Closed
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
