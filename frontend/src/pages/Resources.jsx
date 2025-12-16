import { Compass, Layers, Library, PlayCircle, MonitorPlay, BookOpen, GraduationCap, Wrench, ShieldCheck, ExternalLink, Users } from 'lucide-react';

export default function Resources() {
    const sections = [
        {
            title: 'Start Here',
            blurb: 'Get the foundations right and understand AWS fundamentals.',
            items: [
                {
                    icon: <Compass size={28} color="#FF9900" />,
                    title: 'Getting Started Center',
                    desc: 'Guided intro with curated learning paths for newcomers.',
                    link: 'https://aws.amazon.com/getting-started/',
                    btnText: 'Explore Guide'
                },
                {
                    icon: <BookOpen size={28} color="#FF9900" />,
                    title: 'Skill Builder (Free Tier)',
                    desc: 'Self-paced foundational courses with labs and quizzes.',
                    link: 'https://skillbuilder.aws/',
                    btnText: 'Start Learning'
                },
                {
                    icon: <Library size={28} color="#FF9900" />,
                    title: 'Architecture Center',
                    desc: 'Reference architectures, patterns, and well-architected guidance.',
                    link: 'https://aws.amazon.com/architecture/',
                    btnText: 'View Patterns'
                }
            ]
        },
        {
            title: 'Learn & Practice',
            blurb: 'Hands-on resources to build real workloads.',
            items: [
                {
                    icon: <Wrench size={28} color="#FF9900" />,
                    title: 'AWS Workshops',
                    desc: 'Step-by-step labs for services like Lambda, ECS, and AI.',
                    link: 'https://workshops.aws/',
                    btnText: 'Launch Workshop'
                },
                {
                    icon: <Layers size={28} color="#FF9900" />,
                    title: 'Builders Library',
                    desc: 'Deep dives from Amazon engineers on scaling and reliability.',
                    link: 'https://aws.amazon.com/builders-library/',
                    btnText: 'Read Articles'
                },
                {
                    icon: <MonitorPlay size={28} color="#FF9900" />,
                    title: 'AWS Events YouTube',
                    desc: 'Sessions from re:Invent, Summits, and tech talks.',
                    link: 'https://www.youtube.com/@AWSEventsChannel',
                    btnText: 'Watch Sessions'
                }
            ]
        },
        {
            title: 'Cert Prep',
            blurb: 'Prep for Cloud Practitioner and Associate certifications.',
            items: [
                {
                    icon: <GraduationCap size={28} color="#FF9900" />,
                    title: 'Exam Readiness',
                    desc: 'Official readiness paths and sample questions.',
                    link: 'https://aws.amazon.com/certification/prepare/',
                    btnText: 'Plan Your Path'
                },
                {
                    icon: <ShieldCheck size={28} color="#FF9900" />,
                    title: 'Cloud Practitioner Guide',
                    desc: 'Overview of domains, whitepapers, and FAQs for the CLF-C02.',
                    link: 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
                    btnText: 'View Guide'
                }
            ]
        },
        {
            title: 'Code & Community',
            blurb: 'Ship faster with samples and community support.',
            items: [
                {
                    icon: <PlayCircle size={28} color="#FF9900" />,
                    title: 'Serverless Patterns',
                    desc: 'Repo of battle-tested serverless blueprints.',
                    link: 'https://serverlessland.com/patterns',
                    btnText: 'Browse Patterns'
                },
                {
                    icon: <Layers size={28} color="#FF9900" />,
                    title: 'AWS Samples (GitHub)',
                    desc: 'Official code samples across services and SDKs.',
                    link: 'https://github.com/aws-samples',
                    btnText: 'View Samples'
                },
                {
                    icon: <Users size={28} color="#FF9900" />,
                    title: 'Meetup & Community',
                    desc: 'Join local meetups and our WhatsApp group for help.',
                    link: 'https://www.meetup.com/aws-cloud-club-at-graphic-era/',
                    btnText: 'Join Meetup'
                }
            ]
        }
    ];

    return (
        <main style={{ flex: 1 }}>
            {/* HERO */}
            <section className="resources-hero">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem', color: 'white' }} className="hero-title">
                        Learning Resources
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                        Curated guides, documentation, and tutorials to kickstart your cloud journey.
                    </p>
                </div>
            </section>

            {/* RESOURCES GRID */}
            <section className="resources-container">
                <div className="container resources-list">
                    {sections.map(section => (
                        <div key={section.title} className="resources-section">
                            <div className="resources-section-header">
                                <h2 className="resources-section-title">{section.title}</h2>
                                <p className="resources-section-desc">{section.blurb}</p>
                            </div>
                            <div className="resource-grid">
                                {section.items.map(item => (
                                    <ResourceCard
                                        key={item.title}
                                        icon={item.icon}
                                        title={item.title}
                                        desc={item.desc}
                                        link={item.link}
                                        btnText={item.btnText}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

function ResourceCard({ icon, title, desc, link, btnText }) {
    return (
        <div className="resource-card">
            <div className="resource-icon">
                {icon}
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem', flex: 1 }}>{desc}</p>
            <a href={link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--aws-smile-orange)', textDecoration: 'none', fontWeight: 'bold' }}>
                {btnText} <ExternalLink size={16} />
            </a>
        </div>
    );
}
