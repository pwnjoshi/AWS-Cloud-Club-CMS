import { ExternalLink, BookOpen } from 'lucide-react';

export default function Blog() {
  return (
    <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <BookOpen size={64} color="var(--aws-smile-orange)" style={{ marginBottom: '2rem' }} />
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Club Blog & Articles</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.2rem' }}>
          Read our latest technical articles, tutorials, and club updates on our AWS Community Builder Profile.
        </p>
        <a
          href="https://builder.aws.com/community/@pawanjoshidev"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem', textDecoration: 'none', fontSize: '1.1rem' }}
        >
          Read on AWS Community <ExternalLink size={20} />
        </a>
      </div>
    </main>
  );
}
