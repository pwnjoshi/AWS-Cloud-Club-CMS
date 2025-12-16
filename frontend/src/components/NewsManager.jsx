import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import { authenticatedFetch, getNews } from '../api';

export default function NewsManager() {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        content: '',
        link_text: 'Register Now',
        link_url: '/events',
        is_active: true,
    });

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const data = await getNews();
            // Handle both paginated and non-paginated responses
            const newsList = Array.isArray(data) ? data : (data.results || []);
            setNewsList(newsList);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch news:', err);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                // Update
                const response = await authenticatedFetch(`/api/news/${editingId}/`, {
                    method: 'PUT',
                    body: JSON.stringify(formData),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(JSON.stringify(errorData));
                }
            } else {
                // Create
                const response = await authenticatedFetch('/api/news/', {
                    method: 'POST',
                    body: JSON.stringify(formData),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(JSON.stringify(errorData));
                }
            }
            resetForm();
            fetchNews();
        } catch (err) {
            console.error('Submit error:', err);
            alert('Error: ' + err.message);
        }
    };

    const handleEdit = (news) => {
        setFormData(news);
        setEditingId(news.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const response = await authenticatedFetch(`/api/news/${id}/`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete');
            fetchNews();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const resetForm = () => {
        setFormData({
            content: '',
            link_text: 'Register Now',
            link_url: '/events',
            is_active: true,
        });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div style={{ background: '#1A2332', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem' }}>Breaking News Manager</h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        background: 'var(--aws-blue)',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}
                >
                    <Plus size={18} /> New Announcement
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    style={{
                        background: '#131B29',
                        border: '1px solid rgba(0,115,187,0.2)',
                        borderRadius: '8px',
                        padding: '1.5rem',
                        marginBottom: '2rem',
                    }}
                >
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                            News Content
                        </label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            placeholder="Enter breaking news content..."
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: '#0F1520',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '6px',
                                color: 'white',
                                minHeight: '100px',
                                fontFamily: 'inherit',
                            }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                Link Text
                            </label>
                            <input
                                type="text"
                                name="link_text"
                                value={formData.link_text}
                                onChange={handleInputChange}
                                placeholder="e.g., Register Now"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: '#0F1520',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '6px',
                                    color: 'white',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                Link URL
                            </label>
                            <input
                                type="text"
                                name="link_url"
                                value={formData.link_url}
                                onChange={handleInputChange}
                                placeholder="e.g., /events"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: '#0F1520',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '6px',
                                    color: 'white',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="checkbox"
                            name="is_active"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={handleInputChange}
                            style={{ cursor: 'pointer' }}
                        />
                        <label htmlFor="is_active" style={{ cursor: 'pointer' }}>
                            Active (Display on Home page)
                        </label>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            type="submit"
                            style={{
                                background: 'var(--aws-blue)',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                            }}
                        >
                            {editingId ? 'Update' : 'Create'}
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* News List */}
            {loading ? (
                <div style={{ textAlign: 'center', color: '#9CA3AF' }}>Loading...</div>
            ) : newsList.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {newsList.map((news) => (
                        <div
                            key={news.id}
                            style={{
                                background: '#131B29',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '8px',
                                padding: '1.5rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'start',
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <p style={{ marginBottom: '0.5rem' }}>{news.content}</p>
                                <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>
                                    <span>Link: {news.link_text} → {news.link_url}</span>
                                    {!news.is_active && (
                                        <span style={{ marginLeft: '1rem', color: '#F87171' }}>
                                            (Inactive)
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => handleEdit(news)}
                                    style={{
                                        background: 'rgba(0,115,187,0.2)',
                                        border: 'none',
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        color: 'var(--aws-blue)',
                                    }}
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(news.id)}
                                    style={{
                                        background: 'rgba(244,63,94,0.2)',
                                        border: 'none',
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        color: '#F43F5E',
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ textAlign: 'center', color: '#9CA3AF' }}>
                    No news announcements yet. Create one to get started!
                </p>
            )}
        </div>
    );
}
