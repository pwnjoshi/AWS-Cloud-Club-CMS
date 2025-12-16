import { useState, useEffect } from 'react';
import { authenticatedFetch } from '../api';
import { User, Shield, UserPlus, Trash2 } from 'lucide-react';

export default function UserManager() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
        role: 'MEMBER'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await authenticatedFetch('/api/users/');
            if (res.ok) {
                setUsers(await res.json());
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await authenticatedFetch('/api/users/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert("User created successfully!");
                setShowForm(false);
                setFormData({
                    username: '',
                    password: '',
                    email: '',
                    first_name: '',
                    last_name: '',
                    role: 'MEMBER'
                });
                fetchUsers();
            } else {
                const data = await res.json();
                alert("Failed: " + JSON.stringify(data));
            }
        } catch (error) {
            console.error("Create error", error);
            alert("Error creating user.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            const res = await authenticatedFetch(`/api/users/${id}/`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setUsers(users.filter(u => u.id !== id));
            } else {
                alert("Failed to delete user.");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div style={{ padding: '2rem 3rem', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Shield size={32} color="var(--aws-smile-orange)" />
                    User Management
                </h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <UserPlus size={18} /> {showForm ? 'Cancel' : 'Add User'}
                </button>
            </div>

            {showForm && (
                <div style={{ background: '#1E293B', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Create New User</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9CA3AF' }}>Username</label>
                            <input name="username" value={formData.username} onChange={handleInputChange} style={inputStyle} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9CA3AF' }}>Email</label>
                            <input name="email" type="email" value={formData.email} onChange={handleInputChange} style={inputStyle} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9CA3AF' }}>First Name</label>
                            <input name="first_name" value={formData.first_name} onChange={handleInputChange} style={inputStyle} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9CA3AF' }}>Last Name</label>
                            <input name="last_name" value={formData.last_name} onChange={handleInputChange} style={inputStyle} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9CA3AF' }}>Password</label>
                            <input name="password" type="password" value={formData.password} onChange={handleInputChange} style={inputStyle} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9CA3AF' }}>Role (Permission Level)</label>
                            <select name="role" value={formData.role} onChange={handleInputChange} style={inputStyle}>
                                <option value="MEMBER">Member (Basic Access)</option>
                                <option value="LEAD">Core Lead (Admin Access)</option>
                                <option value="FACULTY">Faculty (Full Access)</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Create Account</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ background: '#1E293B', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <tr>
                            <th style={{ padding: '1rem', color: '#9CA3AF' }}>User</th>
                            <th style={{ padding: '1rem', color: '#9CA3AF' }}>Role</th>
                            <th style={{ padding: '1rem', color: '#9CA3AF' }}>Email</th>
                            <th style={{ padding: '1rem', color: '#9CA3AF' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>Loading users...</td></tr>
                        ) : users.map(user => (
                            <tr key={user.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{user.first_name} {user.last_name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>@{user.username}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '50px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        background: user.role === 'LEAD' ? 'rgba(245, 158, 11, 0.2)' : user.role === 'FACULTY' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                        color: user.role === 'LEAD' ? '#FCD34D' : user.role === 'FACULTY' ? '#34D399' : '#60A5FA'
                                    }}>
                                        {user.role || 'MEMBER'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', color: '#D1D5DB' }}>{user.email}</td>
                                <td style={{ padding: '1rem' }}>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.5rem' }}
                                        title="Delete User"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
