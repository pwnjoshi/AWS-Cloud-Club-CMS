import { useState, useEffect } from 'react';
import { authenticatedFetch } from '../api';
import { FileText, Link as LinkIcon, Download, Plus, Trash2 } from 'lucide-react';

export default function ResourcesView() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const res = await authenticatedFetch('/api/resources/');
            if (res.ok) {
                setResources(await res.json());
            }
        } catch (error) {
            console.error("Fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddResource = async (e) => {
        e.preventDefault();
        const title = e.target.title.value;
        const url = e.target.url.value;
        const description = e.target.description.value;

        try {
            const res = await authenticatedFetch('/api/resources/', {
                method: 'POST',
                body: JSON.stringify({ title, url, description })
            });

            if (res.ok) {
                await fetchResources();
                e.target.reset();
                setShowForm(false);
            } else {
                alert("Failed to add resource");
            }
        } catch (error) {
            console.error("Error adding resource:", error);
        }
    };

    return (
        <div style={{ padding: '2rem 3rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--aws-squid-ink)', marginBottom: '0.5rem' }}>Resources & Assets</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Shared documents, links, and study materials.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary"
                    style={{ borderRadius: '50px', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={18} /> {showForm ? 'Cancel' : 'Add Resource'}
                </button>
            </header>

            {showForm && (
                <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--aws-squid-ink)' }}>Add New Resource</h3>
                    <form onSubmit={handleAddResource} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <input name="title" placeholder="Resource Title (e.g., AWS S3 Cheat Sheet)" style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #E5E7EB' }} required />
                            <input name="url" placeholder="URL (e.g., Google Drive link)" style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #E5E7EB' }} required />
                        </div>
                        <input name="description" placeholder="Short Description (Optional)" style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="btn-primary" style={{ borderRadius: '8px', padding: '0.75rem 2rem' }}>Save Resource</button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? <p>Loading...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {resources.map(res => (
                        <div key={res.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #F3F4F6', transition: 'transform 0.2s', cursor: 'pointer' }} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <div style={{ width: '48px', height: '48px', background: '#E0F2FE', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FileText size={24} color="#0073BB" />
                                </div>
                                <a href={res.url} target="_blank" rel="noopener noreferrer" style={{ color: '#9CA3AF', padding: '0.5rem', borderRadius: '50%', border: '1px solid #E5E7EB', display: 'flex' }}>
                                    <LinkIcon size={16} />
                                </a>
                            </div>

                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--aws-squid-ink)' }}>{res.title}</h3>
                            {res.description && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>{res.description}</p>}

                            <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#9CA3AF' }}>
                                <span>Added by {res.added_by_name || 'Admin'}</span>
                                {new Date(res.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
