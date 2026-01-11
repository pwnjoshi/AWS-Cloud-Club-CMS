import { Target, Lightbulb, Users, Award, Briefcase, CheckCircle, Linkedin, Globe, Rocket, Heart } from 'lucide-react';
import { useEffect } from 'react';

export default function About() {
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
            {/* HERO */}
            {/* HERO */}
            <section className="about-hero">
                <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <h1 className="about-title-gradient animate-fade-in">
                        Building the Future on the Cloud
                    </h1>
                    <p className="hero-subtitle animate-fade-in delay-100">
                        We are Graphic Era University's premier student community dedicated to Amazon Web Services.
                        Bridging the gap between theory and practice.
                    </p>
                </div>
            </section>

            {/* UNIVERSITY & STORY */}
            {/* UNIVERSITY & STORY */}
            <section className="story-section">
                <div className="story-grid reveal-on-scroll">
                    <div>
                        <h2 className="section-title">Our Story</h2>
                        <p className="section-desc" style={{ maxWidth: 'none', margin: '0 0 1.5rem 0', fontSize: '1.25rem', lineHeight: '1.6' }}>
                            <strong>Founded in 2025</strong>, AWS Cloud Club GEU is a student-led initiative dedicated to mastering Amazon Web Services. We bridge the gap between theory and practice, empowering builders to create real-world cloud solutions.
                        </p>
                        <p className="section-desc" style={{ maxWidth: 'none', margin: '0', fontSize: '1.1rem' }}>
                            More than just a club, we are a movement. Whether you're a beginner or a pro, join us to innovate, hack, and grow your career with the power of the Cloud.
                        </p>
                    </div>
                    <div className="stats-grid">
                        <StatCard icon={<Users size={28} color="#FF9900" />} number="100+" label="Active Members" />
                        <StatCard icon={<Rocket size={28} color="#FF9900" />} number="2025" label="Founded" />
                        <StatCard icon={<Globe size={28} color="#FF9900" />} number="4" label="University Campuses" />
                        <StatCard icon={<Award size={28} color="#FF9900" />} number="Growing" label="Community" />
                    </div>
                </div>
            </section>

            {/* VALUES */}
            {/* VALUES */}
            <section className="values-section">
                <div className="values-inner">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 className="section-title">Our Core Values</h2>
                        <p className="section-desc">The principles that guide every workshop, event, and hackathon we organize.</p>
                    </div>

                    <div className="values-grid">
                        <div className="reveal-on-scroll delay-100"><ValueCard title="Innovation" desc="We constantly push boundaries and explore the latest in cloud tech, from Serverless to AI/ML." /></div>
                        <div className="reveal-on-scroll delay-200"><ValueCard title="Community" desc="We grow together. Every member is both a learner and a mentor in our peer-to-peer ecosystem." /></div>
                        <div className="reveal-on-scroll delay-300"><ValueCard title="Excellence" desc="We strive for high standards in our projects, certifications, and technical skills." /></div>
                    </div>
                </div>
            </section>

            {/* FACULTY */}
            {/* FACULTY */}
            <section className="faculty-section">
                <div className="reveal-on-scroll">
                    <h2 className="section-title">Faculty Leadership</h2>
                    <p className="section-desc" style={{ marginBottom: '4rem' }}>Supported by the visionary leadership of Graphic Era University.</p>
                </div>

                <div className="faculty-grid reveal-on-scroll" style={{ display: 'flex', justifyContent: 'center' }}>
                    <FacultyCard
                        name="Dr. Amit Kumar"
                        role="Associate Professor"
                        details="MIEEE PES | Academician | Data Science | ML | NLP | GenAI | AWS Cloud"
                        img="/faculty/dr_amit_kumar.jpg"
                        linkedin="https://www.linkedin.com/in/dr-amit-kumar-49694bb9/"
                    />
                </div>
            </section>

        </main >
    );
}

function StatCard({ icon, number, label }) {
    return (
        <div className="stat-card">
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
        <div className="value-card">
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--aws-smile-orange)' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{desc}</p>
        </div>
    );
}

function FacultyCard({ name, role, details, img, linkedin }) {
    return (
        <div className="faculty-card" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div className="faculty-img-container">
                <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{name}</h3>
            <p style={{ color: 'var(--aws-smile-orange)', fontWeight: '600', marginBottom: '0.5rem' }}>{role}</p>
            {details && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.4' }}>
                    {details}
                </p>
            )}
            {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#0A66C2', textDecoration: 'none' }}>
                    <Linkedin size={20} />
                    <span>Connect on LinkedIn</span>
                </a>
            )}
        </div>
    );
}