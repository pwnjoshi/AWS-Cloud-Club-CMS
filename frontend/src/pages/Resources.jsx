import { Book, Video, FileText, ExternalLink, Code } from 'lucide-react';

export default function Resources() {
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
            <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                    <ResourceCard
                        icon={<Book size={32} color="#FF9900" />}
                        title="AWS Documentation"
                        desc="The official comprehensive guide to all AWS services."
                        link="https://docs.aws.amazon.com/"
                        btnText="Read Docs"
                    />
                    <ResourceCard
                        icon={<Video size={32} color="#FF9900" />}
                        title="AWS Youtube Channel"
                        desc="Video tutorials, conference talks, and demos from the experts."
                        link="https://www.youtube.com/user/AmazonWebServices"
                        btnText="Watch Videos"
                    />
                    <ResourceCard
                        icon={<Code size={32} color="#FF9900" />}
                        title="AWS Workshops"
                        desc="Hands-on workshops and labs to build real-world applications."
                        link="https://workshops.aws/"
                        btnText="Start Building"
                    />
                    <ResourceCard
                        icon={<FileText size={32} color="#FF9900" />}
                        title="Cloud Skills Boost"
                        desc="Google's parallel learning path, good for general cloud concepts too."
                        link="https://www.cloudskillsboost.google/"
                        btnText="Learn More"
                    />
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
