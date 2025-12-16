import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 100, padding: '1rem 0' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem' }}>
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--aws-smile-orange)', borderRadius: '6px' }}></div>
                    <span style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'white' }}>AWS Cloud Club GEU</span>
                </Link>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/about">About</NavLink>
                    <NavLink to="/team">Team</NavLink>
                    <NavLink to="/events">Events</NavLink>
                    <NavLink to="/gallery">Gallery</NavLink>
                    <NavLink to="/resources">Resources</NavLink>
                    <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>Login</Link>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ to, children }) {
    return (
        <Link to={to} style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '500', transition: 'color 0.2s' }} className="nav-link">
            {children}
        </Link>
    );
}
