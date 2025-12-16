import { ArrowRight, Book, Calendar, Code, Users, Zap, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getNews } from '../api';

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
        fetch('http://localhost:8000/api/events/')
            .then(res => res.json())
            .then(data => {
                const upcoming = data.slice(0, 2);
                setEvents(upcoming);
            })
            .catch(err => console.error("Failed to fetch events", err));

        // Fetch Highlights
        fetch('http://localhost:8000/api/highlights/')
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
            <section style={{
                position: 'relative',
                padding: '8rem 2rem 6rem',
                textAlign: 'center',
                background: 'radial-gradient(circle at center, #1A2332 0%, #0F1520 70%)',
                overflow: 'hidden'
            }}>
                {/* Background decoration */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(0,115,187,0.1) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>

                <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '4rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem', background: 'linear-gradient(to right, #fff, #94A3B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Innovate with the Cloud
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
                        Build. Deploy. Scale. Join the largest community of student developers and cloud enthusiasts at Graphic Era Deemed to be University.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <a href="https://www.meetup.com/aws-cloud-club-at-graphic-era/" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem', textDecoration: 'none' }}>Join the Club</a>
                        <Link to="/events" className="btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem', textDecoration: 'none' }}>View Events</Link>
                    </div>
                </div>
            </section>

            {/* BREAKING NEWS TICKER */}
            {news && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#131B29' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
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
            <section style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Our Mission</h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                        We aim to bridge the gap between academic learning and industry standards by providing hands-on experience with Amazon Web Services.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
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
            </section>

            {/* EVENTS PREVIEW */}
            <section style={{ padding: '4rem 2rem', background: '#131B29' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem' }}>Upcoming Events</h2>
                        <Link to="/events" style={{ color: 'var(--aws-blue)', textDecoration: 'none' }}>View All</Link>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', color: '#9CA3AF' }}>Loading...</div>
                    ) : events.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
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
                <section style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '3rem' }}>Recent Highlights</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {highlights.map(h => {
                            const imgUrl = h.image.startsWith('http') ? h.image : `http://localhost:8000${h.image}`;
                            return (
                                <div key={h.id} style={{ borderRadius: '12px', overflow: 'hidden', height: '300px', backgroundImage: `url(${imgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                                    {h.title && (
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
                                            <p style={{ color: 'white', fontWeight: 'bold' }}>{h.title}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

        </main>
    );
}

function MissionCard({ icon, title, desc }) {
    return (
        <div style={{ background: '#1A2332', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '2.5rem' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(0, 115, 187, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                {icon}
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{desc}</p>
        </div>
    );
}

function EventCard({ title, date, loc, img }) {
    return (
        <div style={{ display: 'flex', background: '#1E293B', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ width: '200px', backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            <div style={{ padding: '1.5rem', flex: 1 }}>
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
