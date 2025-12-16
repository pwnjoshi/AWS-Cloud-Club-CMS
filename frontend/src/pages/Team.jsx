import { Github, Linkedin, Twitter, Award, Trophy, Star, Target } from 'lucide-react';

export default function Team() {
    return (
        <main style={{ flex: 1 }}>
            {/* HERO */}
            <section className="team-hero">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem', color: 'white' }}>
                        Meet the Core Team
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                        The dedicated leaders driving the AWS Cloud Club mission at Graphic Era University.
                    </p>
                </div>
            </section>

            {/* CORE TEAM */}
            <section className="core-team-section">
                <div className="team-grid">
                    <LeaderCard
                        name="Pawan Joshi"
                        role="Cloud Club Captain"
                        bio="Leading the club's vision and strategy. AWS Cloud Enthusiast & Community Builder."
                        tags={['Leadership', 'AWS', 'Cloud Architecture']}
                        img="/faculty/dr_amit_kumar.jpg"
                    />
                    <LeaderCard
                        name="Atishay Jain"
                        role="Vice Captain"
                        bio="Overseeing technical workshops and project development. Driving innovation in cloud technologies."
                        tags={['DevOps', 'Management', 'Strategy']}
                        img="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80"
                    />
                </div>
            </section>

            {/* CTA */}
            <section className="team-cta-section">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>Want to be part of this team?</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        We recruit for core team positions at the start of every semester. Join as a member today to start your journey.
                    </p>
                    <a href="https://www.meetup.com/aws-cloud-club-at-graphic-era/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: 'var(--aws-blue)', color: 'white', padding: '1rem 2rem', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>
                        Join the Community
                    </a>
                </div>
            </section>
        </main>
    );
}

function LeaderCard({ name, role, bio, tags, img }) {
    return (
        <div className="leader-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <img src={img} alt={name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--aws-smile-orange)' }} />
                <div>
                    <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'white' }}>{name}</h3>
                    <div style={{ color: 'var(--aws-blue)', fontSize: '0.9rem', fontWeight: '600' }}>{role}</div>
                </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{bio}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                {tags.map((tag, i) => (
                    <span key={i} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: '#D1D5DB' }}>{tag}</span>
                ))}
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <Github size={18} color="#9CA3AF" style={{ cursor: 'pointer' }} />
                <Linkedin size={18} color="#9CA3AF" style={{ cursor: 'pointer' }} />
                <Twitter size={18} color="#9CA3AF" style={{ cursor: 'pointer' }} />
            </div>
        </div>
    );
}

function AchievementCard({ title, desc, date }) {
    return (
        <div className="achievement-card">
            <div style={{ position: 'absolute', top: 0, right: 0, padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderBottomLeftRadius: '12px', fontSize: '0.8rem', color: '#9CA3AF' }}>
                {date}
            </div>
            <Award size={32} color="var(--aws-smile-orange)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'white' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{desc}</p>
        </div>
    );
}

function SpotlightCard({ name, achievement, desc, img }) {
    return (
        <div className="spotlight-card">
            <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <img src={img} alt={name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                        <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'white' }}>{name}</h3>
                        <div style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: '600' }}>{achievement}</div>
                    </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{desc}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem 2rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#9CA3AF' }}>
                <Target size={14} /> Available for hire
            </div>
        </div>
    );
}
