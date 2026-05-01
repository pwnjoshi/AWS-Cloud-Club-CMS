import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { PageHeader, Card, Badge, Button, Input, Textarea, Select, Modal, Spinner } from '../../components/UI';
import { Users, Search, Shield, Ban, Plus, Upload, Pencil } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [showEdit, setShowEdit] = useState(null); // user object
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', role: 'MEMBER' });
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '' });
  const [bulkText, setBulkText] = useState('');
  const [bulkPassword, setBulkPassword] = useState('SBG@2026');
  const [msg, setMsg] = useState('');
  const [editMsg, setEditMsg] = useState('');

  const fetchUsers = (q = '') => {
    setLoading(true);
    api.get(`/admin/users?limit=50&search=${q}`).then(d => { setUsers(d.users || []); setTotal(d.total); }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSearch = (e) => { e.preventDefault(); fetchUsers(search); };

  const toggleRole = async (userId, currentRole) => {
    await api.put(`/admin/users/${userId}`, { role: currentRole === 'ADMIN' ? 'MEMBER' : 'ADMIN' });
    fetchUsers(search);
  };

  const toggleActive = async (userId, isActive) => {
    await api.put(`/admin/users/${userId}`, { isActive: !isActive });
    fetchUsers(search);
  };

  const openEdit = (user) => {
    setShowEdit(user);
    setEditForm({ name: user.name, email: user.email, password: '' });
    setEditMsg('');
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setEditMsg('');
    try {
      const body = {};
      if (editForm.name !== showEdit.name) body.name = editForm.name;
      if (editForm.email !== showEdit.email) body.email = editForm.email;
      if (editForm.password) body.password = editForm.password;

      if (Object.keys(body).length === 0) { setEditMsg('No changes made'); return; }

      await api.put(`/admin/users/${showEdit.id}`, body);
      setEditMsg('User updated successfully');
      fetchUsers(search);
    } catch (err) { setEditMsg(err.message); }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const data = await api.post('/admin/users/create', addForm);
      setMsg(`User created! ${data.generatedPassword ? `Generated password: ${data.generatedPassword}` : ''}`);
      setAddForm({ name: '', email: '', password: '', role: 'MEMBER' });
      fetchUsers(search);
    } catch (err) { setMsg(err.message); }
  };

  const handleBulkAdd = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const lines = bulkText.trim().split('\n').filter(l => l.trim());
      const parsed = lines.map(line => {
        const [name, email] = line.split(',').map(s => s.trim());
        return { name, email };
      }).filter(u => u.name && u.email);

      if (parsed.length === 0) { setMsg('No valid entries. Format: name,email per line'); return; }

      const result = await api.post('/admin/users/bulk', { users: parsed, defaultPassword: bulkPassword });
      setMsg(`Created: ${result.created}, Skipped: ${result.skipped}. Default password: ${result.defaultPassword}`);
      setBulkText('');
      fetchUsers(search);
    } catch (err) { setMsg(err.message); }
  };

  return (
    <div className="animate-in">
      <PageHeader title="Users" subtitle={`${total} total users`} action={
        <div className="flex gap-2">
          <Button onClick={() => setShowAdd(true)} size="sm"><Plus className="w-4 h-4" /> Add User</Button>
          <Button onClick={() => setShowBulk(true)} size="sm" variant="secondary"><Upload className="w-4 h-4" /> Bulk Add</Button>
        </div>
      } />

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
                <Button size="sm" variant="ghost" onClick={() => openEdit(u)} title="Edit user"><Pencil className="w-3.5 h-3.5" /></Button>
                <Button size="sm" variant="ghost" onClick={() => toggleRole(u.id, u.role)} title="Toggle role"><Shield className="w-3.5 h-3.5" /></Button>
                <Button size="sm" variant="ghost" onClick={() => toggleActive(u.id, u.isActive)} title="Toggle active"><Ban className="w-3.5 h-3.5" /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit User Modal */}
      <Modal open={!!showEdit} onClose={() => setShowEdit(null)} title="Edit User">
        {showEdit && (
          <form onSubmit={handleEdit} className="space-y-3">
            <Input label="Name" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required />
            <Input label="Email" type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} required />
            <Input label="New Password (leave blank to keep current)" type="text" value={editForm.password} onChange={e => setEditForm({ ...editForm, password: e.target.value })} placeholder="Min 8 characters" />
            <p className="text-[10px] text-gray-500">Only fill password to reset it. The user will need to use the new password on next login.</p>
            {editMsg && <p className={`text-xs ${editMsg.includes('success') ? 'text-emerald-400' : 'text-red-400'}`}>{editMsg}</p>}
            <Button type="submit" className="w-full">Save Changes</Button>
          </form>
        )}
      </Modal>

      {/* Add User Modal */}
      <Modal open={showAdd} onClose={() => { setShowAdd(false); setMsg(''); }} title="Add User">
        <form onSubmit={handleAddUser} className="space-y-3">
          <Input label="Full Name" value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} required />
          <Input label="Email" type="email" value={addForm.email} onChange={e => setAddForm({ ...addForm, email: e.target.value })} required />
          <Input label="Password (leave blank to auto-generate)" type="text" value={addForm.password} onChange={e => setAddForm({ ...addForm, password: e.target.value })} placeholder="Auto-generated if empty" />
          <Select label="Role" value={addForm.role} onChange={e => setAddForm({ ...addForm, role: e.target.value })}>
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </Select>
          <p className="text-[10px] text-gray-500">A welcome email with credentials will be sent if email service is configured.</p>
          {msg && <p className="text-xs text-gray-400">{msg}</p>}
          <Button type="submit" className="w-full">Create User</Button>
        </form>
      </Modal>

      {/* Bulk Add Modal */}
      <Modal open={showBulk} onClose={() => { setShowBulk(false); setMsg(''); }} title="Bulk Add Users">
        <form onSubmit={handleBulkAdd} className="space-y-3">
          <Textarea label="Users (CSV: name,email per line)" value={bulkText} onChange={e => setBulkText(e.target.value)} placeholder={"Rahul Sharma,rahul@example.com\nPriya Singh,priya@example.com"} required />
          <Input label="Default Password" value={bulkPassword} onChange={e => setBulkPassword(e.target.value)} placeholder="SBG@2026" />
          <p className="text-[10px] text-gray-500">All users get this password and must reset it on first login. They can also use "Continue with Google" to skip the password entirely. Max 200 per batch.</p>
          {msg && <p className="text-xs text-emerald-400">{msg}</p>}
          <Button type="submit" className="w-full"><Upload className="w-4 h-4" /> Import Users</Button>
        </form>
      </Modal>
    </div>
  );
}
