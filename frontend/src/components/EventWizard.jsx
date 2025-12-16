import { useState } from 'react';
import { authenticatedFetch } from '../api';
import { Calendar, Link as LinkIcon, Image, Type, MapPin } from 'lucide-react';

export default function EventWizard({ onCancel, onSuccess, initialData = null }) {
    const [mode, setMode] = useState(initialData ? 'manual' : 'select'); // select, manual, import
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        start_time: initialData?.start_time ? initialData.start_time.slice(0, 16) : '', // Format for datetime-local
        end_time: initialData?.end_time ? initialData.end_time.slice(0, 16) : '', // Format for datetime-local
        location: initialData?.location || '',
        event_type: initialData?.event_type || 'SESSION',
        is_public: initialData?.is_public ?? true,
        registration_link: initialData?.registration_link || ''
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

        // Ensure registration link has protocol
        let regLink = formData.registration_link;
        if (regLink && !/^https?:\/\//i.test(regLink)) {
            regLink = 'https://' + regLink;
        }

        const payload = { ...formData, registration_link: regLink };

        try {
            const url = initialData ? `/api/events/${initialData.id}/` : '/api/events/';
            const method = initialData ? 'PUT' : 'POST';

            const res = await authenticatedFetch(url, {
                method: method,
                body: JSON.stringify(payload) // Use payload with fixed URL
            });
            if (res.ok) {
                // alert(initialData ? "Event Updated!" : "Event Created Successfully!");
                if (onSuccess) onSuccess();
                else onCancel();
            } else {
                alert("Failed to save event.");
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
                <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'white' }}>Create New Event</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div
                        onClick={() => setMode('manual')}
                        style={{ border: '2px dashed #E5E7EB', borderRadius: '16px', padding: '3rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', background: 'rgba(255,255,255,0.05)' }}
                        className="hover-card"
                    >
                        <Calendar size={48} color="var(--aws-smile-orange)" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>Create Manually</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Fill in all the details yourself.</p>
                    </div>

                    <div
                        onClick={() => setMode('import')}
                        style={{ border: '2px dashed #E5E7EB', borderRadius: '16px', padding: '3rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', background: 'rgba(255,255,255,0.05)' }}
                        className="hover-card"
                    >
                        <LinkIcon size={48} color="#0073BB" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>Import from Meetup</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Paste a link to auto-fill details.</p>
                    </div>
                </div>
                <button onClick={onCancel} style={{ marginTop: '2rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancel</button>
            </div>
        );
    }

    if (mode === 'import') {
        return (
            <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'white' }}>Import Event</h2>
                <form onSubmit={handleImport}>
                    <input name="url" placeholder="Paste Meetup.com URL" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '1rem', background: 'rgba(255,255,255,0.05)', color: 'white' }} required />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" onClick={() => setMode('select')} style={{ padding: '0.8rem 2rem', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>Back</button>
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
            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'white' }}>{initialData ? 'Edit Event' : 'Event Details'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#E2E8F0' }}>Event Title</label>
                    <input
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                        required
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#E2E8F0' }}>Description</label>
                    <textarea
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', minHeight: '150px', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                        required
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#E2E8F0' }}>Start Time</label>
                        <input
                            type="datetime-local"
                            value={formData.start_time}
                            onChange={e => setFormData({ ...formData, start_time: e.target.value })}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#E2E8F0' }}>End Time</label>
                        <input
                            type="datetime-local"
                            value={formData.end_time}
                            onChange={e => setFormData({ ...formData, end_time: e.target.value })}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#E2E8F0' }}>Location</label>
                    <input
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#E2E8F0' }}>Registration Link (Optional)</label>
                    <input
                        type="url"
                        placeholder="https://..."
                        value={formData.registration_link || ''}
                        onChange={e => setFormData({ ...formData, registration_link: e.target.value })}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button type="button" onClick={onCancel} style={{ padding: '0.8rem 2rem', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '0.8rem 3rem', borderRadius: '8px' }}>
                        {loading ? 'Saving...' : (initialData ? 'Update Event' : 'Create Event')}
                    </button>
                </div>
            </form>
        </div>
    );
}
