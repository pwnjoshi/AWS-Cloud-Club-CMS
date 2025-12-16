import { Github, Linkedin, Twitter, Award, Trophy, Star, Target } from 'lucide-react';

export default function Team() {
    return (
        <main style={{ flex: 1 }}>
            {/* HERO */}
            <section style={{
                padding: '6rem 2rem',
                textAlign: 'center',
                background: 'radial-gradient(circle at top, #1A2332 0%, #0F1520 70%)',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
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
            <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                    <LeaderCard
                        name="Sarah Jenkins"
                        role="Club Captain"
                        bio="Leading the club's vision and strategy. AWS Certified Solutions Architect."
                        tags={['Leadership', 'Architecture']}
                        img="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80"
                    />
                    <LeaderCard
                        name="David Chen"
                        role="Tech Lead"
                        bio=" overseeing technical workshops and project development. Deeply into Serverless."
                        tags={['DevOps', 'Serverless']}
                        img="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80"
                    />
                    <LeaderCard
                        name="Priya Sharma"
                        role="Community Manager"
                        bio="Building bridges between students and industry experts. Hackathon enthusiast."
                        tags={['Outreach', 'Events']}
                        img="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80"
                    />
                    <LeaderCard
                        name="Marcus Reid"
                        role="Project Lead"
                        bio="Guiding student projects from conception to deployment. Full-stack developer."
                        tags={['React', 'Node.js']}
                        img="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80"
                    />
                </div>
            </section>

            {/* CLUB ACHIEVEMENTS */}
            <section style={{ padding: '6rem 2rem', background: '#131B29' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                        <Trophy size={32} color="#FFD700" />
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Club Achievements</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <AchievementCard
                            title="Best Technical Club 2024"
                            desc="Awarded by the University for organizing the most impactful technical workshops."
                            date="April 2024"
                        />
                        <AchievementCard
                            title="AWS Community Hero Award"
                            desc="Recognized by AWS for outstanding community contributions and evangelism."
                            date="Dec 2023"
                        />
                        <AchievementCard
                            title="Hackathon Champions"
                            desc="Hosted the largest regional cloud hackathon with over 500 participants."
                            date="Oct 2023"
                        />
                    </div>
                </div>
            </section>

            {/* MEMBER SPOTLIGHTS */}
            <section style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                    <Star size={32} color="var(--aws-smile-orange)" />
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Member Spotlights</h2>
                </div>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '4rem', maxWidth: '600px' }}>
                    Celebrating the individual victories and career milestones of our incredible members.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <SpotlightCard
                        name="Rahul Gupta"
                        achievement="Certified Solutions Architect"
                        desc="Cleared the AWS SAA-C03 exam with a score of 950/1000 after attending our bootcamp."
                        img="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80"
                    />
                    <SpotlightCard
                        name="Anita Roy"
                        achievement="Internship at Amazon"
                        desc="Secured a Cloud Support Associate internship through the club's referral network."
                        img="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80"
                    />
                    <SpotlightCard
                        name="Kevin Park"
                        achievement="Open Source Contributor"
                        desc="His contribution to the AWS CDK project was merged and recognized by the core team."
                        img="https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&q=80"
                    />
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '4rem 2rem', textAlign: 'center', background: '#0F1520', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
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
        <div style={{ background: '#1E293B', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'transform 0.2s' }}>
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
        <div style={{ background: '#0F1520', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
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
        <div style={{ background: '#1E293B', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
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
