import { useState, useEffect } from 'react';
import { authenticatedFetch } from '../api';
import { Users, BookOpen, UserCheck, TrendingUp } from 'lucide-react';

export default function FacultyView() {
    const [members, setMembers] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetchMembers(),
            fetchEvents()
        ]).finally(() => setLoading(false));
    }, []);

    const fetchMembers = async () => {
        try {
            const res = await authenticatedFetch('/api/users/');
            if (res.ok) setMembers(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchEvents = async () => {
        try {
            const res = await authenticatedFetch('/api/events/');
            if (res.ok) setEvents(await res.json());
        } catch (e) { console.error(e); }
    };

    return (
        <div style={{ padding: '2rem 3rem' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--aws-squid-ink)', marginBottom: '0.5rem' }}>Faculty Oversight</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Review Core Team performance and Club Agenda.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                {/* Member Stats */}
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={24} color="#0073BB" /> Core Team Stats
                    </h2>
                    {loading ? <p>Loading...</p> : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {members.map(member => (
                                <div key={member.id} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--aws-squid-ink)' }}>{member.first_name || member.username}</h3>
                                        <p style={{ fontSize: '0.9rem', color: '#6B7280', margin: '0.2rem 0 0' }}>{member.email}</p>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--aws-smile-orange)' }}>
                                            {member.task_stats?.completed || 0} / {member.task_stats?.total || 0}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>TASKS DONE</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Agenda View */}
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <BookOpen size={24} color="#FF9900" /> Club Agenda
                    </h2>
                    {loading ? <p>Loading...</p> : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {events.map(ev => (
                                <div key={ev.id} style={{ padding: '1rem', background: 'white', borderRadius: '8px', borderLeft: '4px solid #FF9900', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                    <div style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '0.25rem' }}>{new Date(ev.start_time).toLocaleDateString()}</div>
                                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{ev.title}</h3>
                                    <span style={{ fontSize: '0.8rem', background: '#F3F4F6', padding: '0.1rem 0.5rem', borderRadius: '4px', marginTop: '0.5rem', display: 'inline-block' }}>{ev.event_type}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
