import { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import { Search } from 'lucide-react';

/**
 * Searchable member select dropdown.
 * Props: value (userId), onChange(userId, user), placeholder
 */
export default function MemberSearch({ value, onChange, placeholder = 'Search by name or email...' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  // Search on type
  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    setLoading(true);
    const timer = setTimeout(() => {
      api.get(`/admin/users/search?q=${encodeURIComponent(query)}`)
        .then(d => setResults(d.users || []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (user) => {
    setSelected(user);
    setQuery('');
    setOpen(false);
    onChange(user.id, user);
  };

  const handleClear = () => {
    setSelected(null);
    setQuery('');
    onChange('', null);
  };

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wide">Member</label>

      {selected ? (
        <div className="flex items-center gap-2 bg-[var(--color-bg)] border border-white/10 rounded-lg px-3 py-2.5">
          <div className="w-6 h-6 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[10px] font-bold text-[var(--color-primary)]">
            {selected.name?.charAt(0)?.toUpperCase()}
          </div>
          <span className="text-sm text-white flex-1">{selected.name} <span className="text-gray-500">({selected.email})</span></span>
          <button onClick={handleClear} className="text-gray-400 hover:text-white text-xs">&times;</button>
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => query.length >= 2 && setOpen(true)}
            placeholder={placeholder}
            className="w-full rounded-lg bg-[var(--color-bg)] border border-white/10 pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
          />
        </div>
      )}

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-[var(--color-surface)] border border-white/10 rounded-lg shadow-2xl max-h-48 overflow-y-auto">
          {results.map(user => (
            <button
              key={user.id}
              onClick={() => handleSelect(user)}
              className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-white/5 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-300">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{user.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {open && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute z-50 mt-1 w-full bg-[var(--color-surface)] border border-white/10 rounded-lg shadow-2xl p-3 text-center text-xs text-gray-500">
          No members found
        </div>
      )}
    </div>
  );
}
