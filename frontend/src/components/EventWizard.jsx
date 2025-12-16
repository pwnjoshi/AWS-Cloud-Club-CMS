import { useState } from 'react';
import { authenticatedFetch } from '../api';
import { Calendar, Link as LinkIcon, Image, Type, MapPin } from 'lucide-react';

export default function EventWizard({ onCancel }) {
    const [mode, setMode] = useState('select'); // select, manual, import
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        location: '',
        event_type: 'SESSION',
        is_public: true
    });

    const handleImport = async (e) => {
        e.preventDefault();
        setLoading(true);
        const url = e.target.url.value;
        try {
            const res = await authenticatedFetch('/api/import-meetup-event/', {
                method: 'POST',
                body: JSON.stringify({ url })
            });
            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({
                    ...prev,
                    title: data.title || '',
                    description: data.description || '',
                    // Simple logic to try and parse date or leave empty
                    // In a real app we'd parse ISO strings better
                }));
                setMode('manual'); // Switch to manual mode with pre-filled data
            } else {
                alert("Failed to import event details.");
            }
        } catch (error) {
            console.error(error);
            alert("Error importing event.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authenticatedFetch('/api/events/', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert("Event Created Successfully!");
                onCancel(); // Return to dashboard
            } else {
                alert("Failed to create event.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (mode === 'select') {
        return (
            <div style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--aws-squid-ink)' }}>Create New Event</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div
                        onClick={() => setMode('manual')}
                        style={{ border: '2px dashed #E5E7EB', borderRadius: '16px', padding: '3rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                        className="hover-card"
                    >
                        <Calendar size={48} color="var(--aws-smile-orange)" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Create Manually</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Fill in all the details yourself.</p>
                    </div>

                    <div
                        onClick={() => setMode('import')}
                        style={{ border: '2px dashed #E5E7EB', borderRadius: '16px', padding: '3rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                        className="hover-card"
                    >
                        <LinkIcon size={48} color="#0073BB" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Import from Meetup</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Paste a link to auto-fill details.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (mode === 'import') {
        return (
            <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Import Event</h2>
                <form onSubmit={handleImport}>
                    <input name="url" placeholder="Paste Meetup.com URL" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #E5E7EB', marginBottom: '1rem' }} required />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" onClick={() => setMode('select')} style={{ padding: '0.8rem 2rem', border: 'none', background: '#F3F4F6', borderRadius: '8px', cursor: 'pointer' }}>Back</button>
                        <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '0.8rem 2rem', borderRadius: '8px', flex: 1 }}>
                            {loading ? 'Fetching...' : 'Import Details'}
                        </button>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Event Details</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Event Title</label>
                    <input
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                        required
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Description</label>
                    <textarea
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #E5E7EB', minHeight: '150px' }}
                        required
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Start Time</label>
                        <input
                            type="datetime-local"
                            value={formData.start_time}
                            onChange={e => setFormData({ ...formData, start_time: e.target.value })}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>End Time</label>
                        <input
                            type="datetime-local"
                            value={formData.end_time}
                            onChange={e => setFormData({ ...formData, end_time: e.target.value })}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                            required
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button type="button" onClick={() => setMode('select')} style={{ padding: '0.8rem 2rem', border: 'none', background: '#F3F4F6', borderRadius: '8px', cursor: 'pointer' }}>Back</button>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '0.8rem 3rem', borderRadius: '8px' }}>
                        {loading ? 'Saving...' : 'Create Event'}
                    </button>
                </div>
            </form>
        </div>
    );
}
