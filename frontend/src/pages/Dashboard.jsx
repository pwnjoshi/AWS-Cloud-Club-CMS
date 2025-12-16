import { useEffect, useState } from 'react';
import { authenticatedFetch, logout, API_URL } from '../api';
import { useNavigate } from 'react-router-dom';
import {
    Calendar,
    Settings,
    LogOut,
    Plus,
    Search,
    UserCheck,
    CheckCircle,
    Clock,
    LayoutDashboard,
    Users,
    Image, // Added Image import
    Bell, // Added Bell import
    UserPlus // Added UserPlus import
} from 'lucide-react';

import CalendarView from '../components/CalendarView';
import ResourcesView from '../components/ResourcesView';
import EventWizard from '../components/EventWizard';
import FacultyView from '../components/FacultyView';
import NewsManager from '../components/NewsManager';
import UserManager from '../components/UserManager'; // Import UserManager

import './Dashboard.css';

// ... (existing helper functions if any, but MobileNav will be defined below or here)

export default function Dashboard() {
    const [view, setView] = useState('overview');
    const [user, setUser] = useState(null); // Move user state up

    // Fetch user on mount to determine permissions for Sidebar
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
            case 'calendar': return <CalendarView />;
            case 'resources': return <ResourcesView />;
            case 'event_wizard': return <EventWizard onCancel={() => setView('overview')} />;
            case 'faculty': return <FacultyView />;
            case 'gallery': return <GalleryView />;
            case 'news': return <NewsManager />;
            case 'users': return <UserManager />; // Add Users View
            case 'overview':
            default: return <DashboardContent setView={setView} user={user} />; // Pass user down
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
                <div style={{ width: '32px', height: '32px', background: 'var(--aws-smile-orange)', borderRadius: '6px' }}></div>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>AWS Club CRM</span>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                <div onClick={() => setView('overview')}>
                    <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active={view === 'overview'} />
                </div>
                <NavItem icon={<CheckCircle size={20} />} label="My Tasks" />
                <div onClick={() => setView('calendar')}>
                    <NavItem icon={<Calendar size={20} />} label="Calendar" active={view === 'calendar'} />
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
                <div onClick={() => setView('faculty')}>
                    <NavItem icon={<UserCheck size={20} />} label="Faculty View" active={view === 'faculty'} />
                </div>
                <NavItem icon={<Settings size={20} />} label="Settings" />
            </nav>

            <button onClick={handleLogout} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: 'auto',
                width: '100%'
            }}>
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
            <button className={`mobile-nav-item ${view === 'calendar' ? 'active' : ''}`} onClick={() => setView('calendar')}>
                <Calendar size={24} />
                <span>Events</span>
            </button>
            {isAdmin && (
                <button className={`mobile-nav-item ${view === 'users' ? 'active' : ''}`} onClick={() => setView('users')}>
                    <UserPlus size={24} />
                    <span>Team</span>
                </button>
            )}
            <button className={`mobile-nav-item ${view === 'gallery' ? 'active' : ''}`} onClick={() => setView('gallery')}>
                <Image size={24} />
                <span>Gallery</span>
            </button>
            <button className={`mobile-nav-item ${['resources', 'faculty', 'news'].includes(view) ? 'active' : ''}`} onClick={() => setView('resources')}>
                <Users size={24} />
                <span>More</span>
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

function DashboardContent({ setView, user }) { // Receive user as prop
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await authenticatedFetch('/api/tasks/');
            if (res.ok) {
                setTasks(await res.json());
            }
        } catch (error) {
            console.error("Fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        const title = e.target.title.value;
        const description = e.target.description.value;

        try {
            const res = await authenticatedFetch('/api/tasks/', {
                method: 'POST',
                body: JSON.stringify({ title, description, status: 'TODO' })
            });
            if (res.ok) {
                await fetchTasks();
                e.target.reset();
            } else {
                console.error("Failed to create task", res.status);
                alert("Failed to create task. Check console.");
            }
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: 'white', marginBottom: '0.5rem' }}>Welcome back, {user?.first_name || 'Member'} 👋</h1>
                    <p style={{ color: '#9CA3AF' }}>Here's what's happening with the club today.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9CA3AF' }} />
                        <input placeholder="Search query..." style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '50px', border: '1px solid #374151', width: '250px', maxWidth: '100%', background: '#1E293B', color: 'white', boxSizing: 'border-box' }} />
                    </div>
                    {/* RBAC: Only show New Event for LEAD or FACULTY */}
                    {['LEAD', 'FACULTY'].includes(user?.role) && (
                        <button
                            onClick={() => setView('event_wizard')}
                            className="btn-primary"
                            style={{ borderRadius: '50px', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Plus size={18} /> New Event
                        </button>
                    )}
                </div>
            </header>

            <div className="dashboard-grid">
                <div>
                    <div style={{ background: '#1E293B', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.2)', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white' }}>
                                <CheckCircle size={22} color="var(--aws-smile-orange)" />
                                Rapid Task Entry
                            </h2>
                        </div>
                        <form onSubmit={handleCreateTask} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <input name="title" placeholder="What needs to be done?" style={{ flex: 1, minWidth: '200px', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #374151', background: '#0F1520', color: 'white' }} required />
                            <input name="description" placeholder="Details (Optional)" style={{ flex: 1, minWidth: '200px', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #374151', background: '#0F1520', color: 'white' }} />
                            <button type="submit" className="btn-primary" style={{ borderRadius: '8px' }}>Add</button>
                        </form>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.25rem', color: 'white' }}>Active Tasks</h2>
                        <span style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>Sort by: Due Date</span>
                    </div>

                    {loading ? <p>Loading...</p> : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {tasks.map(task => (
                                <div key={task.id} style={{ background: '#1E293B', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #4B5563' }}></div>
                                        <div>
                                            <h3 style={{ fontSize: '1rem', margin: 0, color: 'white' }}>{task.title}</h3>
                                            {task.description && <p style={{ fontSize: '0.85rem', color: '#9CA3AF', margin: '0.25rem 0 0' }}>{task.description}</p>}
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', borderRadius: '50px', background: 'rgba(245, 158, 11, 0.2)', color: '#FCD34D', fontWeight: '600' }}>{task.status}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <div style={{ background: '#1E293B', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.2)', height: 'fit-content', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                            <Clock size={18} /> Approaching Deadlines
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <EventItem title="Cloud 101 Workshop" date="Tomorrow, 10:00 AM" type="Workshop" />
                            <EventItem title="Core Team Meeting" date="Dec 18, 5:00 PM" type="Meeting" />
                            <EventItem title="AWS Summit Prep" date="Dec 20, 2:00 PM" type="Planning" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



function GalleryView() {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [highlights, setHighlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        fetchHighlights();
        fetchUserRole();
    }, []);

    const fetchUserRole = async () => {
        try {
            const res = await authenticatedFetch('/api/users/me/');
            if (res.ok) {
                const data = await res.json();
                setUserRole(data.role);
            }
        } catch (error) {
            console.error("Failed to fetch user role", error);
        }
    };

    const fetchHighlights = async () => {
        try {
            const res = await fetch(`${API_URL}/api/highlights/`);
            if (res.ok) {
                setHighlights(await res.json());
            }
        } catch (error) {
            console.error("Failed to fetch highlights", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        if (title) formData.append('title', title);

        setUploading(true);
        try {
            const res = await authenticatedFetch('/api/highlights/', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                alert("Upload successful!");
                setTitle('');
                setFile(null);
                document.getElementById('fileInput').value = "";
                fetchHighlights();
            } else {
                const errData = await res.json().catch(() => ({}));
                console.error("Upload failed", res.status, errData);
                alert(`Upload failed: ${res.status} ${JSON.stringify(errData)}`);
            }
        } catch (err) {
            console.error(err);
            alert("Error uploading. Check console.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this highlight?")) return;

        try {
            const res = await authenticatedFetch(`/api/highlights/${id}/`, {
                method: 'DELETE',
            });
            if (res.ok) {
                alert("Deleted successfully");
                setHighlights(highlights.filter(h => h.id !== id));
            } else {
                alert("Failed to delete.");
            }
        } catch (error) {
            console.error("Delete error", error);
            alert("Error deleting.");
        }
    };

    // Check if user has permission
    const canManageGallery = userRole === 'LEAD' || userRole === 'FACULTY';

    if (!canManageGallery && userRole !== null) {
        return (
            <div style={{ padding: '2rem 3rem', color: 'white' }}>
                <div style={{ background: '#1E293B', padding: '3rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#F87171' }}>Access Denied</h2>
                    <p style={{ color: '#9CA3AF' }}>Only Leads and Faculty can manage the gallery.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem 3rem', color: 'white' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Gallery Management</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '3rem' }}>
                {/* Upload Section */}
                <div>
                    <div style={{ background: '#1E293B', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', position: 'sticky', top: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Upload New Highlight</h3>
                        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9CA3AF' }}>Image Title (Optional)</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #374151', background: '#0F1520', color: 'white', boxSizing: 'border-box' }}
                                    placeholder="e.g. Hackathon Winners"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9CA3AF' }}>Image File</label>
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #374151', background: '#0F1520', color: 'white', boxSizing: 'border-box' }}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={uploading}
                                className="btn-primary"
                                style={{ padding: '1rem', borderRadius: '8px', opacity: uploading ? 0.7 : 1, width: '100%' }}
                            >
                                {uploading ? 'Uploading...' : 'Upload to Gallery'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Existing Highlights ({highlights.length})</h3>
                    {loading ? (
                        <p style={{ color: '#9CA3AF' }}>Loading...</p>
                    ) : highlights.length === 0 ? (
                        <div style={{ background: '#1E293B', padding: '3rem', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center' }}>
                            <p style={{ color: '#9CA3AF', fontStyle: 'italic', fontSize: '1.1rem' }}>No highlights yet.</p>
                            <p style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '0.5rem' }}>Upload your first highlight to showcase club events!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
                            {highlights.map(h => {
                                const imgUrl = h.image.startsWith('http') ? h.image : `${API_URL}${h.image}`;
                                return (
                                    <div key={h.id} style={{ background: '#1E293B', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.2s', cursor: 'pointer' }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                        <div style={{ height: '160px', background: `url(${imgUrl}) center/cover no-repeat` }}></div>
                                        <div style={{ padding: '1rem' }}>
                                            <h4 style={{ margin: '0 0 0.5rem', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.title || 'Untitled'}</h4>
                                            <p style={{ color: '#9CA3AF', fontSize: '0.75rem', marginBottom: '1rem' }}>
                                                {h.uploaded_at ? new Date(h.uploaded_at).toLocaleDateString() : 'Unknown date'}
                                            </p>
                                            <button
                                                onClick={() => handleDelete(h.id)}
                                                style={{ width: '100%', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', color: '#F87171', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function EventItem({ title, date, type }) {
    return (
        <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#374151', padding: '0.5rem 0.75rem', borderRadius: '8px', color: 'white' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>DEC</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>16</span>
            </div>
            <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'white' }}>{title}</h4>
                <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: '#9CA3AF' }}>{date}</p>
                <span style={{ fontSize: '0.75rem', color: '#60A5FA', background: 'rgba(96, 165, 250, 0.1)', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>{type}</span>
            </div>
        </div>
    )
}
