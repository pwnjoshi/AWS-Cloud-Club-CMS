import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Calendar, ClipboardCheck, Star, Trophy, BookOpen, Award,
  Users, Gift, User, LogOut, Shield, Menu, X, ChevronDown, Cloud
} from 'lucide-react';
import { useState } from 'react';

const memberNav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/events', icon: Calendar, label: 'Events' },
  { to: '/attendance', icon: ClipboardCheck, label: 'Attendance' },
  { to: '/points', icon: Star, label: 'Points' },
  { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { to: '/resources', icon: BookOpen, label: 'Resources' },
  { to: '/certificates', icon: Award, label: 'Certificates' },
  { to: '/referrals', icon: Users, label: 'Referrals' },
  { to: '/rewards', icon: Gift, label: 'Rewards' },
];

const adminNav = [
  { to: '/admin', icon: Shield, label: 'Admin Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/events', icon: Calendar, label: 'Events' },
  { to: '/admin/certificates', icon: Award, label: 'Certificates' },
  { to: '/admin/points', icon: Star, label: 'Points' },
  { to: '/admin/announcements', icon: LayoutDashboard, label: 'Announcements' },
  { to: '/admin/rewards', icon: Gift, label: 'Rewards' },
  { to: '/admin/aws-lab', icon: Cloud, label: 'AWS Lab' },
  { to: '/admin/audit', icon: ClipboardCheck, label: 'Audit Log' },
];

// Bottom nav (mobile) — show top 5
const mobileNav = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/events', icon: Calendar, label: 'Events' },
  { to: '/points', icon: Star, label: 'Points' },
  { to: '/leaderboard', icon: Trophy, label: 'Board' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Shell({ children }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminExpanded, setAdminExpanded] = useState(false);
  const location = useLocation();

  const isAdmin = user?.role === 'ADMIN';
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)]">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-[var(--color-surface)] fixed inset-y-0 left-0 z-40">
        <div className="p-5 border-b border-white/5">
          <h1 className="text-sm font-bold text-white tracking-wide">AWS SBG GEU</h1>
          <p className="text-[11px] text-gray-500 mt-0.5">Member Portal</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {memberNav.map(item => (
            <SidebarLink key={item.to} {...item} />
          ))}

          {isAdmin && (
            <>
              <div className="pt-4 pb-1 px-3">
                <button onClick={() => setAdminExpanded(!adminExpanded)} className="flex items-center justify-between w-full text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-300 transition-colors">
                  <span>Admin</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${adminExpanded ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {adminExpanded && adminNav.map(item => (
                <SidebarLink key={item.to} {...item} />
              ))}
            </>
          )}
        </nav>

        <div className="p-3 border-t border-white/5">
          <NavLink to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors mb-1">
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] text-xs font-bold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
            </div>
          </NavLink>
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 w-full text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-50 h-14 bg-[var(--color-surface)]/95 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4">
        <h1 className="text-sm font-bold text-white">AWS SBG GEU</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-300">
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 inset-y-0 w-72 bg-[var(--color-surface)] border-r border-white/5 pt-16 overflow-y-auto">
            <nav className="px-3 py-3 space-y-0.5">
              {memberNav.map(item => (
                <SidebarLink key={item.to} {...item} onClick={() => setSidebarOpen(false)} />
              ))}
              {isAdmin && (
                <>
                  <div className="pt-4 pb-1 px-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Admin</span>
                  </div>
                  {adminNav.map(item => (
                    <SidebarLink key={item.to} {...item} onClick={() => setSidebarOpen(false)} />
                  ))}
                </>
              )}
            </nav>
            <div className="p-3 border-t border-white/5 mt-4">
              <button onClick={() => { logout(); setSidebarOpen(false); }} className="flex items-center gap-2 px-3 py-2 w-full text-sm text-gray-400 hover:text-red-400 rounded-lg transition-colors">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pb-20 lg:pb-8 pt-14 lg:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 h-16 bg-[var(--color-surface)]/95 backdrop-blur-md border-t border-white/5 flex items-center justify-around px-2">
        {mobileNav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${isActive ? 'text-[var(--color-primary)]' : 'text-gray-500'}`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function SidebarLink({ to, icon: Icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      end={to === '/' || to === '/admin'}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`
      }
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </NavLink>
  );
}
