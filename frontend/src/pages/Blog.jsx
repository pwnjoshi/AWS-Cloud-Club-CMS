import { useEffect, useState } from 'react';
import { authenticatedFetch } from '../api';

export default function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Placeholder: fetch posts when backend endpoint exists
    // authenticatedFetch('/api/blog/').then(async (res) => {
    //   if (res.ok) setPosts(await res.json());
    // });
  }, []);

  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '900px', margin: '0 auto', color: 'white' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Club Blog</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Members can publish blogs from the dashboard. Coming soon.
      </p>

      {posts.length === 0 ? (
        <div style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem' }}>
          <p style={{ color: '#9CA3AF' }}>No posts yet.</p>
        </div>
      ) : (
        posts.map((p) => (
          <article key={p.id} style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem' }}>{p.title}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{p.content}</p>
          </article>
        ))
      )}
    </div>
  );
}
