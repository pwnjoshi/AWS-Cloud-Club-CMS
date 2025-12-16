import { useEffect, useState } from 'react';
import { authenticatedFetch, API_URL } from '../api';
import { User, Calendar, Clock, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchPosts();
  }, [debouncedSearch]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      // Use public fetch if possible, or authenticatedFetch (doesn't matter for GET if public allowed)
      // We'll use simple fetch for public access
      let url = `${API_URL}/api/blog/`;
      if (debouncedSearch) {
        url += `?search=${encodeURIComponent(debouncedSearch)}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        setPosts(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1000px' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Club Blog
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
          Insights, tutorials, and updates from the AWS Cloud Club team.
        </p>

        <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 3rem',
              borderRadius: '50px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
              backdropFilter: 'blur(10px)'
            }}
          />
          <Search size={20} color="var(--text-tertiary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-tertiary)' }}>Loading posts...</div>
      ) : posts.length === 0 ? (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '4rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>No posts found.</p>
          {debouncedSearch && <button onClick={() => setSearch('')} style={{ marginTop: '1rem', background: 'none', border: 'none', color: 'var(--aws-smile-orange)', cursor: 'pointer' }}>Clear Search</button>}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {posts.map((post) => (
            <Link to={`/blog/${post.id}`} key={post.id} className="glass-panel" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', padding: '0', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.2s' }}>
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.title}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '100%', height: '200px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>No Cover Image</span>
                </div>
              )}

              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: '0.8rem' }}>
                  <span>{post.author_name}</span>
                  <span>•</span>
                  <span>{formatDate(post.created_at)}</span>
                </div>

                <h2 style={{ fontSize: '1.4rem', marginBottom: '0.8rem', color: 'white', fontWeight: 'bold', lineHeight: '1.3' }}>{post.title}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {post.content}
                </p>

                <div style={{ color: 'var(--aws-smile-orange)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  Read Article <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
