import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import { Cloud, Lock, User } from 'lucide-react';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await login(username, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Cloud size={48} color="var(--aws-smile-orange)" fill="var(--aws-smile-orange)" style={{ marginBottom: '1rem' }} />
                    <h2 style={{ color: 'var(--aws-squid-ink)' }}>Sign In</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome back to the Club</p>
                </div>

                {error && (
                    <div style={{ backgroundColor: '#fff5f5', color: '#c53030', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Username</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.2rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.2rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem' }}>Sign In</button>
                </form>
            </div>
        </div>
    );
}
