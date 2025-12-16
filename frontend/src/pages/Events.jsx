import { Calendar, MapPin, Clock, ArrowRight, X, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { EVENTS } from '../data/mockData';

export default function Events() {
    const [events] = useState(EVENTS);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Scroll Animation Logic
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.reveal-on-scroll');
        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const showModal = (event) => {
        setSelectedEvent(event);
    };

    const closeModal = () => {
        setSelectedEvent(null);
    };

    return (
        <main style={{ flex: 1, paddingTop: '4rem', paddingBottom: '4rem' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 className="animate-fade-in" style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', background: 'linear-gradient(to right, #FFF, #94A3B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Upcoming Events
                    </h1>
                    <p className="animate-fade-in delay-100" style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                        Join workshops, hackathons, and meetups designed to level up your cloud skills.
                    </p>
                </div>

                {events.length > 0 ? (
                    <div className="events-grid reveal-on-scroll">
                        {events.map(event => (
                            <EventCard key={event.id} event={event} onDetails={() => showModal(event)} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <Calendar size={48} color="var(--text-secondary)" />
                        <h3>No upcoming events</h3>
                        <p>Check back later for new workshops and sessions.</p>
                    </div>
                )}
            </div>

            {/* EVENT DETAILS MODAL */}
            {selectedEvent && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div style={{ background: '#1E293B', borderRadius: '16px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <button onClick={closeModal} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer', zIndex: 10 }}>
                            <X size={20} />
                        </button>

                        <div style={{ height: '250px', backgroundImage: `url(${selectedEvent.image})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem 1.5rem 1rem', background: 'linear-gradient(to top, #1E293B, transparent)' }}></div>
                        </div>

                        <div style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', lineHeight: '1.3' }}>{selectedEvent.title}</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#94A3B8' }}>
                                    <Calendar size={20} color="var(--aws-smile-orange)" />
                                    <span>{new Date(selectedEvent.start_time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#94A3B8' }}>
                                    <Clock size={20} color="var(--aws-smile-orange)" />
                                    <span>{new Date(selectedEvent.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#94A3B8', gridColumn: '1 / -1' }}>
                                    <MapPin size={20} color="var(--aws-smile-orange)" />
                                    <span>{selectedEvent.location}</span>
                                </div>
                            </div>

                            <p style={{ lineHeight: '1.6', color: '#D1D5DB', marginBottom: '2rem' }}>
                                {selectedEvent.description || "Join us for this exciting event!"}
                            </p>

                            {selectedEvent.registration_link ? (
                                <a
                                    href={selectedEvent.registration_link.startsWith('http') ? selectedEvent.registration_link : `https://${selectedEvent.registration_link}`}
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
        </main>
    );
}

function EventCard({ event, onDetails }) {
    return (
        <div className="event-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid rgba(255,255,255,0.08)', background: '#1E293B' }}>
            <div className="event-image-container" style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                <img
                    src={event.image}
                    alt={event.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(15, 23, 42, 0.8)', padding: '0.35rem 0.85rem', borderRadius: '50px', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.8rem', fontWeight: '600' }}>
                    {event.start_time === "TBA" ? "TBA" : new Date(event.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
            </div>
            <div className="event-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', lineHeight: '1.4', color: 'white' }}>{event.title}</h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    <span>{event.start_time === "TBA" ? "Time: TBA" : new Date(event.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>•</span>
                    <span>{event.location}</span>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button
                        onClick={onDetails}
                        className="btn-secondary"
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0.75rem', width: '100%', gap: '0.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                        View Details <Info size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
