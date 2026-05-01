import { createPortal } from 'react-dom';

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Card({ children, className = '', onClick }) {
  return (
    <div onClick={onClick} className={`bg-[var(--color-surface)] border border-white/5 rounded-xl p-5 ${onClick ? 'cursor-pointer hover:border-white/10 transition-colors' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function StatBox({ label, value, icon, color = 'text-[var(--color-primary)]' }) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg bg-white/5 ${color}`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-gray-400 mt-0.5">{label}</p>
        </div>
      </div>
    </Card>
  );
}

export function Badge({ children, variant = 'default' }) {
  const styles = {
    default: 'bg-white/5 text-gray-300 border-white/10',
    primary: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    accent: 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-[var(--color-accent)]/20',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${styles[variant] || styles.default}`}>
      {children}
    </span>
  );
}

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-sm' };
  const variants = {
    primary: 'bg-[var(--color-primary)] text-black hover:bg-[#e68a00]',
    secondary: 'bg-white/5 text-white border border-white/10 hover:bg-white/10',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Input({ label, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wide">{label}</label>}
      <input className="w-full rounded-lg bg-[var(--color-bg)] border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all" {...props} />
    </div>
  );
}

export function Select({ label, children, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wide">{label}</label>}
      <select className="w-full rounded-lg bg-[var(--color-bg)] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all" {...props}>
        {children}
      </select>
    </div>
  );
}

export function Textarea({ label, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wide">{label}</label>}
      <textarea className="w-full rounded-lg bg-[var(--color-bg)] border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all resize-none" rows={4} {...props} />
    </div>
  );
}

export function EmptyState({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-gray-500">{icon}</div>
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-400 max-w-sm">{description}</p>}
    </div>
  );
}

export function Spinner() {
  return <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />;
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[var(--color-surface)] border border-white/10 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto animate-in">
        <div className="sticky top-0 z-10 bg-[var(--color-surface)] border-b border-white/5 px-5 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-xl leading-none">&times;</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>,
    document.body
  );
}
