import { ArrowRight, Book, Calendar, Code, Users, Zap, AlertCircle } from 'lucide-react';
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
        fetch(`${API_URL}/api/events/`)
            .then(res => res.json())
            .then(data => {
                const upcoming = data.slice(0, 2);
                setEvents(upcoming);
            })
            .catch(err => console.error("Failed to fetch events", err));

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
                                    date={new Date(evt.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    loc={evt.location}
                                    img="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600"
                                />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '16px' }}>
                            <Calendar size={48} color="#9CA3AF" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>No Upcoming Events</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Check back later or join our Discord for updates.</p>
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

function EventCard({ title, date, loc, img }) {
    return (
        <div className="event-card">
            <div className="event-image" style={{ backgroundImage: `url(${img})` }}></div>
            <div className="event-content">
                <div style={{ fontSize: '0.85rem', color: 'var(--aws-blue)', fontWeight: 'bold', marginBottom: '0.5rem' }}>{date}</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Some quick description about the event goes here.</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>{loc}</span>
                    <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Register</button>
                </div>
            </div>
        </div>
    );
}
