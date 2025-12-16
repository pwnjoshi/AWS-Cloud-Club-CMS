import { ArrowRight, Book, Calendar, Code, Users, Zap, AlertCircle, Clock, MapPin } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EVENTS, NEWS, HIGHLIGHTS } from '../data/mockData';

export default function Home() {
    const events = EVENTS;
    const highlights = HIGHLIGHTS;
    const news = NEWS[0];

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

    return (
        <main style={{ flex: 1 }}>

            {/* HERO SECTION */}
            <section className="hero-section">
                {/* Background decoration */}
                <div className="hero-bg-decoration"></div>

                <div className="hero-content">
                    <h1 className="hero-title animate-fade-in">
                        Innovate with the Cloud
                    </h1>
                    <p className="hero-subtitle animate-fade-in delay-100">
                        Build. Deploy. Scale. Join the largest community of student developers and cloud enthusiasts at Graphic Era Deemed to be University.
                    </p>
                    <div className="cta-row animate-fade-in delay-200">
                        <a href="https://www.meetup.com/aws-cloud-club-at-graphic-era/" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem', textDecoration: 'none' }}>Join the Club</a>
                        <Link to="/events" className="btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem', textDecoration: 'none' }}>View Events</Link>
                    </div>
                </div>
            </section>

            {/* BREAKING NEWS TICKER */}
            {news && (
                <div className="ticker animate-fade-in delay-300">
                    <div className="container ticker-row">
                        <div className="ticker-left">
                            <div className="ticker-badge">
                                <Zap size={16} fill="white" color="white" />
                                <span>Breaking News</span>
                            </div>
                            <span className="ticker-message">{news.content}</span>
                        </div>
                        {news.link_url && (
                            news.link_url.startsWith('http') ? (
                                <a href={news.link_url} target="_blank" rel="noopener noreferrer" className="ticker-btn">
                                    {news.link_text || 'Learn More'} <ArrowRight size={16} />
                                </a>
                            ) : (
                                <Link to={news.link_url} className="ticker-btn">
                                    {news.link_text || 'Learn More'} <ArrowRight size={16} />
                                </Link>
                            )
                        )}
                    </div>
                </div>
            )}

            {/* MISSION SECTION */}
            <section className="section-padding">
                <div className="container section-header reveal-on-scroll">
                    <h2 className="section-title">Our Mission</h2>
                    <p className="section-desc">
                        We aim to bridge the gap between academic learning and industry standards by providing hands-on experience with Amazon Web Services.
                    </p>
                </div>

                <div className="container">
                    <div className="grid-auto">
                        <div className="reveal-on-scroll delay-100" style={{ height: '100%' }}>
                            <MissionCard
                                icon={<Book size={32} color="#0073BB" />}
                                title="Learn"
                                desc="Master core and advanced cloud concepts through expert-led workshops and seminars."
                            />
                        </div>
                        <div className="reveal-on-scroll delay-200" style={{ height: '100%' }}>
                            <MissionCard
                                icon={<Code size={32} color="#0073BB" />}
                                title="Build"
                                desc="Apply your knowledge by working on real-world projects and competing in hackathons."
                            />
                        </div>
                        <div className="reveal-on-scroll delay-300" style={{ height: '100%' }}>
                            <MissionCard
                                icon={<Users size={32} color="#0073BB" />}
                                title="Connect"
                                desc="Network with industry experts, alumni, and like-minded peers in the tech community."
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* EVENTS PREVIEW */}
            <section className="section-padding" style={{ background: '#131B29' }}>
                <div className="container">
                    <div className="events-header-row reveal-on-scroll">
                        <h2 style={{ fontSize: '2rem' }}>Upcoming Events</h2>
                        <Link to="/events" style={{ color: 'var(--aws-blue)', textDecoration: 'none' }}>View All</Link>
                    </div>

                    {events.length > 0 ? (
                        <div className="events-grid">
                            {events.map(evt => (
                                <EventCard
                                    key={evt.id}
                                    title={evt.title}
                                    // Format date manually or use logic
                                    date={new Date(evt.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    time={new Date(evt.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    loc={evt.location}
                                    img={evt.image}
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
                                return (
                                    <div key={h.id} className="highlight-card" style={{ backgroundImage: `url(${h.image})` }}>
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
