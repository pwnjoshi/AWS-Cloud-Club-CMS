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

    return (
        <div style={{ padding: '2rem 3rem', color: 'white' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Gallery</h2>
            <div style={{ display: 'grid', gridTemplateColumns: canManage ? 'minmax(300px, 1fr) 2fr' : '1fr', gap: '3rem' }}>
                {canManage && (
                    <div style={{ background: '#1E293B', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', height: 'fit-content' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Upload New</h3>
                        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (Optional)" style={inputStyle} />
                            <input id="fileInput" type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} style={inputStyle} required />
                            <button type="submit" disabled={uploading} className="btn-primary" style={{ width: '100%' }}>{uploading ? '...' : 'Upload'}</button>
                        </form>
                    </div>
                )}
                <div>
                    {loading ? <p>Loading...</p> : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                            {highlights.map(h => (
                                <div key={h.id} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '16/9' }}>
                                    <img src={h.image.startsWith('http') ? h.image : `${API_URL}${h.image}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    {canManage && (
                                        <button onClick={() => handleDelete(h.id)} style={{ position: 'absolute', top: '5px', right: '5px', background: 'red', color: 'white', border: 'none', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer' }}>X</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #374151',
    background: '#0F1520',
    color: 'white'
};
