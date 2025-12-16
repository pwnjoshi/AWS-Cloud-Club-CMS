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
            <section style={{
                padding: '6rem 2rem',
                textAlign: 'center',
                background: 'radial-gradient(circle at top, #1A2332 0%, #0F1520 70%)',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem', color: 'white' }}>
                        Learning Resources
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                        Curated guides, documentation, and tutorials to kickstart your cloud journey.
                    </p>
                </div>
            </section>

            {/* RESOURCES GRID */}
            <section style={{ padding: '4rem 0' }}>
                <div className="container" style={{ display: 'grid', gap: '3.5rem' }}>
                    {sections.map(section => (
                        <div key={section.title} style={{ display: 'grid', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                                <div>
                                    <h2 style={{ margin: 0, fontSize: '1.75rem' }}>{section.title}</h2>
                                    <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>{section.blurb}</p>
                                </div>
                            </div>
                            <div className="grid-auto" style={{ gap: '1.75rem' }}>
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
        <div style={{ background: '#1E293B', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ marginBottom: '1.5rem', background: 'rgba(255,153,0,0.1)', width: 'fit-content', padding: '1rem', borderRadius: '12px' }}>
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
