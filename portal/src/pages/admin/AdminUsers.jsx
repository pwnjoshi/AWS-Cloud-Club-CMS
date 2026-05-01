import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { PageHeader, Card, Badge, Button, Input, Select, Modal, Spinner } from '../../components/UI';
import { Users, Search, Shield, Ban } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchUsers = (q = '') => {
    setLoading(true);
    api.get(`/admin/users?limit=50&search=${q}`).then(d => { setUsers(d.users || []); setTotal(d.total); }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSearch = (e) => { e.preventDefault(); fetchUsers(search); };

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'MEMBER' : 'ADMIN';
    await api.put(`/admin/users/${userId}`, { role: newRole });
    fetchUsers(search);
  };

  const toggleActive = async (userId, isActive) => {
    await api.put(`/admin/users/${userId}`, { isActive: !isActive });
    fetchUsers(search);
  };

  return (
    <div className="animate-in">
      <PageHeader title="Users" subtitle={`${total} total users`} />

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <Input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1" />
        <Button type="submit" variant="secondary"><Search className="w-4 h-4" /></Button>
      </form>

      {loading ? <div className="flex justify-center py-10"><Spinner /></div> : (
        <div className="space-y-2">
          {users.map(u => (
            <Card key={u.id} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-sm font-bold text-gray-300 shrink-0">
                {u.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{u.name}</p>
                <p className="text-xs text-gray-500 truncate">{u.email}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={u.role === 'ADMIN' ? 'danger' : 'default'}>{u.role}</Badge>
                <Badge variant={u.isActive ? 'success' : 'danger'}>{u.isActive ? 'Active' : 'Inactive'}</Badge>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button size="sm" variant="ghost" onClick={() => toggleRole(u.id, u.role)} title="Toggle role"><Shield className="w-3.5 h-3.5" /></Button>
                <Button size="sm" variant="ghost" onClick={() => toggleActive(u.id, u.isActive)} title="Toggle active"><Ban className="w-3.5 h-3.5" /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
