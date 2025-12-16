import { useState, useEffect } from 'react';
import { authenticatedFetch } from '../api';
import { User, Lock, Mail, Save, AlertCircle } from 'lucide-react';

export default function SettingsView() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        username: ''
    });
    const [passwordData, setPasswordData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await authenticatedFetch('/api/users/me/');
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    email: data.email || '',
                    username: data.username || ''
                });
                setUserId(data.id);
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setMessage(null);
        setSaving(true);

        try {
            const res = await authenticatedFetch(`/api/users/${userId}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email
                })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                const err = await res.json();
                setMessage({ type: 'error', text: 'Update failed: ' + JSON.stringify(err) });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred.' });
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (passwordData.password !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }

        setSaving(true);
        try {
            const res = await authenticatedFetch(`/api/users/${userId}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: passwordData.password
                })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Password changed successfully!' });
                setPasswordData({ password: '', confirmPassword: '' });
            } else {
                const err = await res.json();
                if (res.status === 403) {
                    setMessage({ type: 'error', text: 'Permission denied. You may not have permission to change this password.' });
                } else {
                    setMessage({ type: 'error', text: 'Update failed: ' + JSON.stringify(err) });
                }

            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ color: 'white', padding: '2rem' }}>Loading...</div>;

    return (
        <div style={{ padding: '2rem 3rem', color: 'white', maxWidth: '800px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>Account Settings</h2>

            {message && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '2rem',
                    borderRadius: '8px',
                    background: message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: message.type === 'success' ? '#34D399' : '#F87171',
                    border: `1px solid ${message.type === 'success' ? '#059669' : '#DC2626'}`
                }}>
                    {message.text}
                </div>
            )}

            <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <User size={20} color="var(--aws-smile-orange)" /> Profile Information
                </h3>
                <form onSubmit={handleProfileUpdate} style={{ background: '#1E293B', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9CA3AF' }}>First Name</label>
                            <input
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9CA3AF' }}>Last Name</label>
                            <input
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                style={inputStyle}
                            />
                        </div>
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9CA3AF' }}>Email Address</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9CA3AF' }}>Username</label>
                        <input value={formData.username} style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} disabled />
                        <p style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '0.25rem' }}>Username cannot be changed.</p>
                    </div>

                    <button type="submit" className="btn-primary" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Save size={18} /> {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                </form>
            </div>

            <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Lock size={20} color="var(--aws-smile-orange)" /> Security
                </h3>
                <form onSubmit={handlePasswordUpdate} style={{ background: '#1E293B', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9CA3AF' }}>New Password</label>
                        <input
                            type="password"
                            value={passwordData.password}
                            onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                            style={inputStyle}
                            minLength={8}
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9CA3AF' }}>Confirm New Password</label>
                        <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            style={inputStyle}
                            minLength={8}
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={saving || !passwordData.password} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Save size={18} /> {saving ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
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
    color: 'white',
    boxSizing: 'border-box'
};
