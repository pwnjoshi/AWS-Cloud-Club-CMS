import { useEffect, useState } from 'react';
import { authenticatedFetch, API_URL } from '../api';
import { User, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      // Use public fetch if possible, or authenticatedFetch (doesn't matter for GET if public allowed)
      // We'll use simple fetch for public access
      let url = `${API_URL}/api/blog/`;
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
    <div className="container blog-container">
      <header className="blog-header">
        <h1 className="blog-title">
          Club Blog
        </h1>
        <p className="blog-subtitle">
          Insights, tutorials, and updates from the AWS Cloud Club team.
        </p>
      </header>

      {loading ? (
        <div className="blog-loading">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="blog-empty">
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>No posts found.</p>
        </div>
      ) : (
        <div className="blog-grid">
          {posts.map((post) => (
            <Link to={`/blog/${post.id}`} key={post.id} className="glass-panel blog-card">
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.title}
                  className="blog-card-image"
                />
              ) : (
                <div className="blog-card-placeholder">
                  <span style={{ color: 'var(--text-tertiary)' }}>No Cover Image</span>
                </div>
              )}

              <div className="blog-card-content">
                <div className="blog-meta">
                  <span>{post.author_name}</span>
                  <span>•</span>
                  <span>{formatDate(post.created_at)}</span>
                </div>

                <h2 className="blog-card-title">{post.title}</h2>
                <p className="blog-card-excerpt">
                  {post.content}
                </p>

                <div className="blog-read-more">
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
