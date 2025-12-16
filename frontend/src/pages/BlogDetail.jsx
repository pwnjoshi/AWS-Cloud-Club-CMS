import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authenticatedFetch, API_URL } from '../api';
import { User, Calendar, ArrowLeft } from 'lucide-react';

export default function BlogDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // Public fetch - we made sure permission is IsAuthenticatedOrReadOnly
                const res = await fetch(`${API_URL}/api/blog/${id}/`);
                if (res.ok) setPost(await res.json());
                else console.error("Post not found");
            } catch (error) {
                console.error("Failed to fetch post", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>;
    if (!post) return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Post not found.</div>;

    return (
        <div className="container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
            <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2rem' }}>
                <ArrowLeft size={20} /> Back to Blog
            </Link>

            <article>
                <header style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-tertiary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <User size={16} />
                            <span>{post.author_name}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Calendar size={16} />
                            <span>{formatDate(post.created_at)}</span>
                        </div>
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', lineHeight: '1.2' }}>{post.title}</h1>
                </header>

                {post.image && (
                    <img
                        src={post.image}
                        alt={post.title}
                        style={{ width: '100%', borderRadius: '16px', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                )}

                <div
                    style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}
                >
                    {post.content}
                </div>
            </article>
        </div>
    );
}
