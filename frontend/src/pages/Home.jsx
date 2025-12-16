import { ArrowRight, Book, Calendar, Code, Users, Zap, AlertCircle, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getNews, API_URL } from '../api';

export default function Home() {
    const [events, setEvents] = useState([]);
    const [highlights, setHighlights] = useState([]);
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch News
        getNews()
            .then(data => {
                // API returns an array directly, not paginated
                const newsList = Array.isArray(data) ? data : (data.results || []);
                if (newsList.length > 0) {
                    setNews(newsList[0]); // Get the latest news
                }
            })
            .catch(err => console.error("Failed to fetch news", err));

        // Fetch Events
        const fetchEvents = async () => {
            try {
                const res = await fetch(`${API_URL}/api/events/`);
                if (res.ok) {
                    const data = await res.json();
                    // Just take top 2, empty array is fine
                    const upcoming = data.slice(0, 2);
                    setEvents(upcoming);
                }
            } catch (err) {
                console.error("Failed to fetch events", err);
            }
        };
        fetchEvents();

        // Fetch Highlights
        fetch(`${API_URL}/api/highlights/`)
            .then(res => res.json())
            .then(data => {
                setHighlights(data.slice(0, 3)); // Show top 3
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch highlights", err);
                setLoading(false);
            });
    }, []);

    return (
        <main style={{ flex: 1 }}>

            {/* HERO SECTION */}
            <section className="hero-section">
                {/* Background decoration */}
                <div className="hero-bg-decoration"></div>

                <div className="hero-content">
                    <h1 className="hero-title">
                        Innovate with the Cloud
                    </h1>
                    <p className="hero-subtitle">
                        Build. Deploy. Scale. Join the largest community of student developers and cloud enthusiasts at Graphic Era Deemed to be University.
                    </p>
                    <div className="cta-row">
                        <a href="https://www.meetup.com/aws-cloud-club-at-graphic-era/" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem', textDecoration: 'none' }}>Join the Club</a>
                        <Link to="/events" className="btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem', textDecoration: 'none' }}>View Events</Link>
                    </div>
                </div>
            </section>

            {/* BREAKING NEWS TICKER */}
            {news && (
                <div className="ticker">
                    <div className="container ticker-row" style={{ padding: '1rem 0' }}>
                        <div className="ticker-left">
                            <Zap size={20} color="var(--aws-smile-orange)" />
                            <span style={{ fontWeight: 'bold', color: 'white' }}>Breaking News</span>
                            <span style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }}></span>
                            <span style={{ color: 'var(--text-secondary)' }}>{news.content}</span>
                        </div>
                        {news.link_url && (
                            news.link_url.startsWith('http') ? (
                                <a href={news.link_url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--aws-blue)', textDecoration: 'none', fontWeight: '600', whiteSpace: 'nowrap' }}>
                                    {news.link_text || 'Learn More'} <ArrowRight size={16} />
                                </a>
                            ) : (
                                <Link to={news.link_url} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--aws-blue)', textDecoration: 'none', fontWeight: '600', whiteSpace: 'nowrap' }}>
                                    {news.link_text || 'Learn More'} <ArrowRight size={16} />
                                </Link>
                            )
                        )}
                    </div>
                </div>
            )}

            {/* MISSION SECTION */}
            <section className="section-padding">
                <div className="container section-header">
                    <h2 className="section-title">Our Mission</h2>
                    <p className="section-desc">
                        We aim to bridge the gap between academic learning and industry standards by providing hands-on experience with Amazon Web Services.
                    </p>
                </div>

                <div className="container">
                    <div className="grid-auto">
                        <MissionCard
                            icon={<Book size={32} color="#0073BB" />}
                            title="Learn"
                            desc="Master core and advanced cloud concepts through expert-led workshops and seminars."
                        />
                        <MissionCard
                            icon={<Code size={32} color="#0073BB" />}
                            title="Build"
                            desc="Apply your knowledge by working on real-world projects and competing in hackathons."
                        />
                        <MissionCard
                            icon={<Users size={32} color="#0073BB" />}
                            title="Connect"
                            desc="Network with industry experts, alumni, and like-minded peers in the tech community."
                        />
                    </div>
                </div>
            </section>

            {/* EVENTS PREVIEW */}
            <section className="section-padding" style={{ background: '#131B29' }}>
                <div className="container">
                    <div className="events-header-row">
                        <h2 style={{ fontSize: '2rem' }}>Upcoming Events</h2>
                        <Link to="/events" style={{ color: 'var(--aws-blue)', textDecoration: 'none' }}>View All</Link>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', color: '#9CA3AF' }}>Loading...</div>
                    ) : events.length > 0 ? (
                        <div className="events-grid">
                            {events.map(evt => (
                                <EventCard
                                    key={evt.id}
                                    title={evt.title}
                                    // Format date manually or use logic
                                    date={new Date(evt.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    time={new Date(evt.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    loc={evt.location}
                                    img="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600"
                                    link={evt.registration_link}
                                />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '16px' }}>
                            <Calendar size={48} color="#9CA3AF" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>No upcoming events yet</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Stay tuned 🚀</p>
                        </div>
                    )}
                </div>
            </section>

            {/* GALLERY / HIGHLIGHTS */}
            {highlights.length > 0 && (
                <section className="section-padding">
                    <div className="container">
                        <h2 style={{ fontSize: '2rem', marginBottom: '3rem' }}>Recent Highlights</h2>
                        <div className="grid-auto">
                            {highlights.map(h => {
                                const imgUrl = h.image.startsWith('http') ? h.image : `${API_URL}${h.image}`;
                                return (
                                    <div key={h.id} className="highlight-card" style={{ backgroundImage: `url(${imgUrl})` }}>
                                        {h.title && (
                                            <div className="highlight-overlay">
                                                <p style={{ color: 'white', fontWeight: 'bold' }}>{h.title}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

        </main>
    );
}

function MissionCard({ icon, title, desc }) {
    return (
        <div className="mission-card">
            <div className="mission-icon-box">
                {icon}
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{desc}</p>
        </div>
    );
}

function EventCard({ title, date, time, loc, img, link }) {
    return (
        <div className="event-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid rgba(255,255,255,0.08)', background: '#1E293B' }}>
            <div className="event-image-container" style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                <img
                    src={img}
                    alt={title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute', top: '1rem', right: '1rem',
                    background: 'rgba(15, 23, 42, 0.9)', padding: '0.35rem 0.85rem',
                    borderRadius: '50px', backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff', fontSize: '0.8rem', fontWeight: '600', zIndex: 2
                }}>
                    {date}
                </div>
            </div>

            <div className="event-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', lineHeight: '1.4', color: 'white', fontWeight: '700' }}>{title}</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', color: '#94A3B8', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} /> {time}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> {loc}</div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {link ? (
                        <a
                            href={link.startsWith('http') ? link : `https://${link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                            style={{
                                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
                                padding: '0.75rem', fontSize: '0.95rem', textDecoration: 'none', width: '100%',
                                background: 'var(--aws-blue)',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                            }}
                        >
                            Register Now <ArrowRight size={16} style={{ flexShrink: 0 }} />
                        </a>
                    ) : (
                        <button disabled className="btn-primary" style={{ padding: '0.75rem', fontSize: '0.95rem', width: '100%', opacity: 0.5, cursor: 'not-allowed', background: 'var(--aws-blue)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            Registration Closed
                        </button>
                    )}

                    <Link
                        to="/events"
                        className="btn-secondary"
                        style={{
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            padding: '0.75rem', fontSize: '0.95rem', width: '100%',
                            border: '1px solid rgba(255,255,255,0.1)',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            textDecoration: 'none'
                        }}
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
