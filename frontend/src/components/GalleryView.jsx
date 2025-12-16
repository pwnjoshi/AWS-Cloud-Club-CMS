import { useState, useEffect } from 'react';
import { authenticatedFetch, API_URL } from '../api';

export default function GalleryView({ user }) {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [highlights, setHighlights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHighlights();
    }, []);

    const fetchHighlights = async () => {
        try {
            const res = await fetch(`${API_URL}/api/highlights/`);
            if (res.ok) setHighlights(await res.json());
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        if (title) formData.append('title', title);
        setUploading(true);
        try {
            const res = await authenticatedFetch('/api/highlights/', { method: 'POST', body: formData });
            if (res.ok) {
                alert("Upload successful!");
                setTitle(''); setFile(null); document.getElementById('fileInput').value = "";
                fetchHighlights();
            } else { alert("Upload failed."); }
        } catch (err) { alert("Error uploading."); } finally { setUploading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete highlight?")) return;
        try {
            const res = await authenticatedFetch(`/api/highlights/${id}/`, { method: 'DELETE' });
            if (res.ok) setHighlights(highlights.filter(h => h.id !== id));
        } catch (error) { console.error(error); }
    };

    const canManage = ['LEAD', 'FACULTY'].includes(user?.role);
    console.log("GalleryView User:", user, "Role:", user?.role, "CanManage:", canManage);

    return (
        <div className="gallery-container">
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: '#FF9900' }}>📸</span> Gallery
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: canManage ? 'minmax(300px, 1fr) 2fr' : '1fr', gap: '3rem' }}>
                {canManage && (
                    <div style={{ background: '#1E293B', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', height: 'fit-content' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', color: 'white' }}>Upload New Memory</h3>
                        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title (Optional)"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #374151', background: '#0F1520', color: 'white' }}
                            />
                            <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #374151', background: '#0F1520', color: 'white' }}
                                    required
                                />
                            </div>
                            <button type="submit" disabled={uploading} className="btn-primary" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}>
                                {uploading ? 'Uploading...' : 'Upload Image'}
                            </button>
                        </form>
                    </div>
                )}

                <div style={{ width: '100%' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '4rem' }}>Loading memories...</div>
                    ) : (
                        <>
                            {highlights.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '4rem', color: '#6B7280', border: '2px dashed #374151', borderRadius: '16px' }}>
                                    <p style={{ fontSize: '1.2rem' }}>No memories shared yet.</p>
                                    {canManage && <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Use the form to upload the first photo!</p>}
                                </div>
                            ) : (
                                <div className="gallery-grid">
                                    {highlights.map(h => (
                                        <div key={h.id} className="gallery-item">
                                            <img
                                                src={h.image.startsWith('http') ? h.image : `${API_URL}${h.image}`}
                                                alt={h.title || 'Gallery Image'}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <div className="gallery-overlay">
                                                {h.title && <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '0.5rem' }}>{h.title}</h4>}
                                                {canManage && (
                                                    <button
                                                        onClick={() => handleDelete(h.id)}
                                                        style={{ background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.85rem', width: 'fit-content' }}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );

}
