import { useEffect, useState } from 'react';
import { authenticatedFetch, logout, API_URL } from '../api';
import { useNavigate } from 'react-router-dom';
import {
    Settings,
    LogOut,
    UserPlus,
    LayoutDashboard,
    Users,
    Image,
    Bell,
    ArrowRight,
    Shield,
    User
} from 'lucide-react';

import ResourcesView from '../components/ResourcesView';
import EventWizard from '../components/EventWizard';
import NewsManager from '../components/NewsManager';
import UserManager from '../components/UserManager';
import SettingsView from '../components/SettingsView';
import GalleryView from '../components/GalleryView';

import './Dashboard.css';

export default function Dashboard() {
    const [view, setView] = useState('overview');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await authenticatedFetch('/api/users/me/');
                if (res.ok) setUser(await res.json());
            } catch (e) { console.error(e); }
        };
        fetchMe();
    }, []);

    const renderContent = () => {
        switch (view) {
            case 'resources': return <ResourcesView />;
            case 'event_wizard': return <EventWizard onCancel={() => setView('overview')} />;
            case 'gallery': return <GalleryView user={user} />;
            case 'news': return <NewsManager />;
            case 'users': return <UserManager />;
            case 'settings': return <SettingsView />;
            case 'overview':
            default: return <DashboardContent setView={setView} user={user} />;
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar view={view} setView={setView} user={user} />
            <div className="dashboard-content">
                {renderContent()}
            </div>
            <MobileNav view={view} setView={setView} user={user} />
        </div>
    );
}

function Sidebar({ view, setView, user }) {
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isAdmin = ['LEAD', 'FACULTY'].includes(user?.role);

    return (
        <div className="dashboard-sidebar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', paddingLeft: '0.5rem' }}>
                <img src="/logo.png" alt="AWS Club" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>Club CRM</span>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                <div onClick={() => setView('overview')}>
                    <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active={view === 'overview'} />
                </div>

                {isAdmin && (
                    <div onClick={() => setView('users')}>
                        <NavItem icon={<UserPlus size={20} />} label="Manage Team" active={view === 'users'} />
                    </div>
                )}

                <div onClick={() => setView('gallery')}>
                    <NavItem icon={<Image size={20} />} label="Gallery" active={view === 'gallery'} />
                </div>
                <div onClick={() => setView('news')}>
                    <NavItem icon={<Bell size={20} />} label="Breaking News" active={view === 'news'} />
                </div>
                <div onClick={() => setView('resources')}>
                    <NavItem icon={<Users size={20} />} label="Resources" active={view === 'resources'} />
                </div>

                <div onClick={() => setView('settings')}>
                    <NavItem icon={<Settings size={20} />} label="Settings" active={view === 'settings'} />
                </div>
            </nav>

            <button onClick={handleLogout} className="logout-btn">
                <LogOut size={18} />
                Sign Out
            </button>
        </div>
    );
}

function MobileNav({ view, setView, user }) {
    const isAdmin = ['LEAD', 'FACULTY'].includes(user?.role);
    return (
        <div className="dashboard-bottom-nav">
            <button className={`mobile-nav-item ${view === 'overview' ? 'active' : ''}`} onClick={() => setView('overview')}>
                <LayoutDashboard size={24} />
                <span>Home</span>
            </button>
            <button className={`mobile-nav-item ${view === 'settings' ? 'active' : ''}`} onClick={() => setView('settings')}>
                <Settings size={24} />
                <span>Settings</span>
            </button>
            {isAdmin && (
                <button className={`mobile-nav-item ${view === 'users' ? 'active' : ''}`} onClick={() => setView('users')}>
                    <UserPlus size={24} />
                    <span>Team</span>
                </button>
            )}
            <button className={`mobile-nav-item ${['gallery', 'news', 'resources'].includes(view) ? 'active' : ''}`} onClick={() => setView('gallery')}>
                <Image size={24} />
                <span>Media</span>
            </button>
        </div>
    );
}

function NavItem({ icon, label, active }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            background: active ? 'var(--aws-smile-orange)' : 'transparent',
            color: active ? 'var(--aws-squid-ink)' : 'var(--text-secondary)',
            fontWeight: active ? '600' : '400',
            transition: 'all 0.2s'
        }}>
            <span style={{ color: active ? 'var(--aws-squid-ink)' : '#9CA3AF' }}>{icon}</span>
            <span style={{ color: active ? 'var(--aws-squid-ink)' : '#D1D5DB' }}>{label}</span>
        </div>
    );
}

function DashboardContent({ setView, user }) {
    return (
        <div style={{ padding: '2rem 3rem', color: 'white' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                    Welcome back, <span style={{ color: 'var(--aws-smile-orange)' }}>{user?.first_name || 'Member'}</span> 👋
                </h1>
                <p style={{ color: '#9CA3AF', fontSize: '1.1rem' }}>Manage your profile, access resources, and stay updated.</p>
            </header>

            <div className="overview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* Profile Card */}
                <div className="dashboard-card" style={{ background: '#1E293B', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF9900 0%, #FF5252 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
                            {user?.first_name?.[0]}{user?.last_name?.[0]}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{user?.first_name} {user?.last_name}</h2>
                            <span style={{
                                display: 'inline-block', marginTop: '0.25rem', fontSize: '0.8rem', padding: '0.25rem 0.75rem', borderRadius: '50px',
                                background: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA', fontWeight: '600', border: '1px solid rgba(59, 130, 246, 0.3)'
                            }}>
                                {user?.role || 'MEMBER'}
                            </span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <span>Email</span>
                            <span>{user?.email}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <span>Username</span>
                            <span>@{user?.username}</span>
                        </div>
                    </div>
                    <button onClick={() => setView('settings')} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                        Manage Profile
                    </button>
                </div>

                {/* Club Status / Admin Quick Actions */}
                <div className="dashboard-card" style={{ background: '#1E293B', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Shield size={20} color="#34D399" /> Club Status
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ background: 'rgba(15, 21, 32, 0.5)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>Active</div>
                            <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Status</div>
                        </div>
                        <div style={{ background: 'rgba(15, 21, 32, 0.5)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>2025</div>
                            <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Season</div>
                        </div>
                    </div>

                    <h4 style={{ color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Actions</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button onClick={() => setView('resources')} style={quickActionStyle}>
                            <span>Browse Resources</span> <ArrowRight size={16} />
                        </button>
                        <button onClick={() => setView('gallery')} style={quickActionStyle}>
                            <span>View Gallery</span> <ArrowRight size={16} />
                        </button>
                        {['LEAD', 'FACULTY'].includes(user?.role) && (
                            <button onClick={() => setView('users')} style={{ ...quickActionStyle, color: '#FCD34D', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
                                <span>Manage Team</span> <ArrowRight size={16} />
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

const quickActionStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.8rem 1rem',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    color: '#E2E8F0',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '0.95rem'
};



