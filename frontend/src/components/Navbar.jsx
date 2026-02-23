import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, CloudLightning } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${
      isOpen ? 'bg-[#020617] border-white/5' : 
      scrolled ? 'border-white/5 bg-[#020617]/95 backdrop-blur-md shadow-lg shadow-black/20 py-2' : 'border-transparent bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img src="/logo.png" alt="AWS Cloud Club GEU" className="h-16 md:h-20 w-auto object-contain transform group-hover:scale-105 transition-transform duration-300" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About Us</NavLink>
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/team">Team</NavLink>
            <NavLink to="/blog">Blog</NavLink>
            
            <a 
              href="https://www.meetup.com/aws-cloud-club-at-graphic-era/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-5 py-2 bg-white text-black hover:bg-gray-200 rounded-md font-semibold shadow-lg shadow-white/5 hover:shadow-white/10 hover:-translate-y-0.5 transition-all duration-300 text-sm"
            >
              Join Club
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-300 hover:text-white transition-colors relative z-50"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#020617] pt-24 px-4">
          <div className="flex flex-col items-center gap-6">
            <MobileNavLink to="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
            <MobileNavLink to="/about" onClick={() => setIsOpen(false)}>About Us</MobileNavLink>
            <MobileNavLink to="/events" onClick={() => setIsOpen(false)}>Events</MobileNavLink>
            <MobileNavLink to="/team" onClick={() => setIsOpen(false)}>Team</MobileNavLink>
            <MobileNavLink to="/blog" onClick={() => setIsOpen(false)}>Blog</MobileNavLink>
            
            <a 
              href="https://www.meetup.com/aws-cloud-club-at-graphic-era/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 px-8 py-3 bg-[var(--color-primary)] rounded-md font-bold text-white w-full text-center hover:bg-[#e68a00] transition-colors"
            >
              Join Club
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`text-sm font-medium transition-colors relative group py-2 ${isActive ? 'text-[var(--color-primary)]' : 'text-gray-300 hover:text-[var(--color-primary)]'}`}
    >
      {children}
      <span className={`absolute bottom-0 left-0 h-0.5 bg-[var(--color-primary)] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
    </Link>
  );
}

function MobileNavLink({ to, children, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`text-xl font-bold ${isActive ? 'text-[#FF9900]' : 'text-gray-300'}`}
    >
      {children}
    </Link>
  );
}
