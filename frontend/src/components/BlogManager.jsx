import { useState, useEffect } from 'react';
import { authenticatedFetch, API_URL } from '../api';
import { Plus, Edit2, Trash2, X, Upload, Search, Image as ImageIcon } from 'lucide-react';

export default function BlogManager() {
    const [posts, setPosts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [formData, setFormData] = useState({ title: '', content: '', is_published: true, image: null });
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await authenticatedFetch('/api/blog/');
            if (res.ok) setPosts(await res.json());
        } catch (error) {
            console.error("Failed to fetch posts", error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('content', formData.content);
        data.append('is_published', formData.is_published);
        if (formData.image instanceof File) {
            data.append('image', formData.image);
        }

        try {
            const url = editingPost ? `/api/blog/${editingPost.id}/` : '/api/blog/';
            const method = editingPost ? 'PATCH' : 'POST';

            // Note: authenticatedFetch usually handles JSON, but for FormData we need to be careful with Content-Type.
            // authenticatedFetch might set Content-Type to application/json automatically which breaks FormData.
            // We'll use a custom fetch here or assume authenticatedFetch handles it if we pass body as FormData (standard fetch does).
            // Let's use standard fetch with token from localStorage helper if available, or just authenticatedFetch and hope it doesn't force JSON.
            // Actually, best to use authenticatedFetch but pass headers explicitly to let browser set boundary.

            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}${url}`, {
                method: method,
                headers: {
                    'Authorization': `Token ${token}`
                    // Do NOT set Content-Type for FormData, browser sets it with boundary
                },
                body: data
            });

            if (res.ok) {
                fetchPosts();
                closeModal();
            } else {
                console.error("Failed to save post");
            }
        } catch (error) {
            console.error("Error saving post", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        try {
            await authenticatedFetch(`/api/blog/${id}/`, { method: 'DELETE' });
            fetchPosts();
        } catch (error) {
            console.error("Failed to delete post", error);
        }
    };

    const openModal = (post = null) => {
        if (post) {
            setEditingPost(post);
            setFormData({ title: post.title, content: post.content, is_published: post.is_published, image: null });
            setImagePreview(post.image);
        } else {
            setEditingPost(null);
            setFormData({ title: '', content: '', is_published: true, image: null });
            setImagePreview(null);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPost(null);
        setFormData({ title: '', content: '', is_published: true, image: null });
        setImagePreview(null);
    };

    return (
        <div className="text-white">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Blog Management</h2>
                <button
                    onClick={() => openModal()}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem' }}
                >
                    <Plus size={18} /> New Post
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {posts.map(post => (
                    <div key={post.id} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
                        {post.image ? (
                            <img src={post.image} alt={post.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />
                        ) : (
                            <div style={{ width: '100%', height: '180px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ImageIcon size={40} color="var(--text-tertiary)" />
                            </div>
                        )}
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{post.title}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                            {post.content}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <span style={{ fontSize: '0.8rem', color: post.is_published ? '#34D399' : '#F87171', background: post.is_published ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                                {post.is_published ? 'Published' : 'Draft'}
                            </span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => openModal(post)} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60A5FA', border: 'none', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer' }}>
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(post.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: 'none', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="glass-panel" style={{ width: '90%', maxWidth: '600px', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: '#111827' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{editingPost ? 'Edit Post' : 'New Post'}</h3>
                            <button onClick={closeModal} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="input-field"
                                    required
                                    style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Cover Image</label>
                                <div style={{ border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '8px', padding: '1rem', textAlign: 'center', cursor: 'pointer', position: 'relative' }}>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                    />
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" style={{ maxHeight: '200px', borderRadius: '8px' }} />
                                    ) : (
                                        <div style={{ color: 'var(--text-tertiary)', padding: '2rem 0' }}>
                                            <Upload size={32} style={{ marginBottom: '0.5rem' }} />
                                            <p>Click or Drag to Upload Image</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Content</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    required
                                    rows={8}
                                    style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontFamily: 'inherit', resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.is_published}
                                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                    id="published-check"
                                    style={{ width: '18px', height: '18px' }}
                                />
                                <label htmlFor="published-check" style={{ color: 'white' }}>Publish immediately</label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary"
                                style={{ marginTop: '1rem', padding: '0.8rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                {loading ? 'Saving...' : (editingPost ? 'Update Post' : 'Create Post')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
