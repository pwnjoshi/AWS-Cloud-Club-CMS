import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [open, setOpen] = useState(false);

    const toggleMenu = () => setOpen(prev => !prev);
    const closeMenu = () => setOpen(false);

    return (
        <nav className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 100, padding: '0.9rem 0' }}>
            <div className="container navbar" style={{ position: 'relative' }}>
                <Link to="/" onClick={closeMenu} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src="/logo.png" alt="AWS Cloud Club GEU" style={{ height: '35px' }} />
                    <span style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'white' }}>AWS Cloud Club GEU</span>
                </Link>

                <button className="nav-toggle" onClick={toggleMenu} aria-label={open ? 'Close menu' : 'Open menu'}>
                    {open ? <X size={22} /> : <Menu size={22} />}
                </button>

                <div className={`nav-links ${open ? 'open' : ''}`}>
                    <NavLink to="/" onNavigate={closeMenu}>Home</NavLink>
                    <NavLink to="/about" onNavigate={closeMenu}>About</NavLink>
                    <NavLink to="/team" onNavigate={closeMenu}>Team</NavLink>
                    <NavLink to="/events" onNavigate={closeMenu}>Events</NavLink>
                    <NavLink to="/gallery" onNavigate={closeMenu}>Gallery</NavLink>
                    <NavLink to="/blog" onNavigate={closeMenu}>Blog</NavLink>

                    <a href="https://www.meetup.com/aws-cloud-club-at-graphic-era/" target="_blank" rel="noopener noreferrer" className="btn-primary nav-login" style={{ textDecoration: 'none', padding: '0.6rem 1.1rem', fontSize: '0.9rem' }}>Join Community</a>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ to, children, onNavigate }) {
    return (
        <Link
            to={to}
            onClick={onNavigate}
            style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '500', transition: 'color 0.2s' }}
            className="nav-link"
        >
            {children}
        </Link>
    );
}
