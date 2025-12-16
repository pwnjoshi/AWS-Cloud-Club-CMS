import { Target, Lightbulb, Users, Award, Briefcase, CheckCircle } from 'lucide-react';

export default function About() {
    return (
        <main style={{ flex: 1 }}>
            {/* HERO */}
            <section style={{
                padding: '8rem 2rem 6rem',
                textAlign: 'center',
                background: 'radial-gradient(circle at top, #1A2332 0%, #0F1520 70%)',
                overflow: 'hidden'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem', background: 'linear-gradient(to right, #fff, #94A3B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Building the Future on the Cloud
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', lineHeight: '1.6' }}>
                        We are Graphic Era University's premier student community dedicated to Amazon Web Services.
                        Bridging the gap between theory and practice.
                    </p>
                </div>
            </section>

            {/* UNIVERSITY & STORY */}
            <section style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <img src="/geu_logo.png" alt="GEU Logo" style={{ height: '80px', width: 'auto' }} />
                            <div style={{ height: '50px', width: '2px', background: 'rgba(255,255,255,0.1)' }}></div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', lineHeight: '1.2' }}>
                                Graphic Era<br />University
                            </div>
                        </div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Our Story</h2>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                            Founded in 2023, the AWS Cloud Club at GEU started with a simple idea: that students learn best by doing.
                            What began as a small study group has grown into a vibrant ecosystem of cloud enthusiasts, supported officially by the university and AWS.
                        </p>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem' }}>
                            We provide a platform for students to experiment with cloud technologies, get certified, and connect with industry leaders.
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <StatCard icon={<Users size={24} color="#FF9900" />} number="500+" label="Active Members" />
                        <StatCard icon={<Award size={24} color="#0073BB" />} number="50+" label="AWS Certified" />
                        <StatCard icon={<Briefcase size={24} color="#10B981" />} number="12+" label="Corporate Partners" />
                        <StatCard icon={<Lightbulb size={24} color="#8B5CF6" />} number="20+" label="Projects Shipped" />
                    </div>
                </div>
            </section>

            {/* VALUES */}
            <section style={{ padding: '6rem 2rem', background: '#131B29' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Our Core Values</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>The principles that guide every workshop, event, and hackathon we organize.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
                        <ValueCard title="Innovation" desc="We constantly push boundaries and explore the latest in cloud tech, from Serverless to AI/ML." />
                        <ValueCard title="Community" desc="We grow together. Every member is both a learner and a mentor in our peer-to-peer ecosystem." />
                        <ValueCard title="Excellence" desc="We strive for high standards in our projects, certifications, and technical skills." />
                    </div>
                </div>
            </section>

            {/* FACULTY */}
            <section style={{ padding: '6rem 2rem', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Faculty Leadership</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '4rem' }}>Supported by the visionary leadership of Graphic Era University.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <FacultyCard name="Dr. Amit Sharma" role="HOD, CS Department" img="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80" />
                    <FacultyCard name="Prof. Neha Gupta" role="Cloud Club Mentor" img="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80" />
                </div>
            </section>

        </main>
    );
}

function StatCard({ icon, number, label }) {
    return (
        <div style={{ background: '#1E293B', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', marginBottom: '1rem' }}>
                {icon}
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{number}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{label}</div>
        </div>
    );
}

function ValueCard({ title, desc }) {
    return (
        <div style={{ background: '#1A2332', padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--aws-smile-orange)' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{desc}</p>
        </div>
    );
}

function FacultyCard({ name, role, img }) {
    return (
        <div style={{ background: '#1E293B', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 1.5rem', overflow: 'hidden', border: '3px solid var(--aws-blue)' }}>
                <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{name}</h3>
            <p style={{ color: 'var(--aws-smile-orange)', fontWeight: '600' }}>{role}</p>
        </div>
    );
}
