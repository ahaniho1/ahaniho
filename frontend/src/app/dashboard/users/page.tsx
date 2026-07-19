'use client';
import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function DashboardUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', roleId: '' });
  const [roles, setRoles] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchUsers(); fetchRoles(); }, []);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data?.users || data?.data || []);
    } catch {}
    setLoading(false);
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${API_URL}/roles`);
      const data = await res.json();
      setRoles(Array.isArray(data) ? data : data?.roles || data?.data || []);
    } catch {}
  };

  const handleToggleStatus = async (user: any) => {
    const action = user.isActive ? 'deactivate' : 'activate';
    if (!confirm(`${action} this user?`)) return;
    try {
      await fetch(`${API_URL}/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      fetchUsers();
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const url = editingId ? `${API_URL}/users/${editingId}` : `${API_URL}/users`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save user');
      setShowForm(false);
      setEditingId(null);
      setForm({ firstName: '', lastName: '', email: '', password: '', roleId: '' });
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Error saving user');
    }
    setSubmitting(false);
  };

  const roleStyle: Record<string, string> = {
    administrator: 'bg-blue-100 text-blue-700',
    publisher: 'bg-green-100 text-green-700',
    service_staff: 'bg-purple-100 text-purple-700',
    public_user: 'bg-gray-100 text-gray-700',
  };

  if (loading) return <div className="p-8 flex items-center justify-center"><div className="text-gray-400">Loading users...</div></div>;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold">Users</h1><p className="text-gray-500 text-sm">Manage platform users and roles</p></div>
        <button onClick={() => { setEditingId(null); setForm({ firstName: '', lastName: '', email: '', password: '', roleId: '' }); setShowForm(true); }}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all">+ Add User</button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-xs">Name</th>
              <th className="text-left px-5 py-3 font-semibold text-xs">Email</th>
              <th className="text-left px-5 py-3 font-semibold text-xs">Role</th>
              <th className="text-left px-5 py-3 font-semibold text-xs">Status</th>
              <th className="text-left px-5 py-3 font-semibold text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-gray-400">No users found.</td></tr>
            ) : (
              users.map((u: any) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="px-5 py-3.5 font-medium">{u.firstName} {u.lastName}</td>
                  <td className="px-5 py-3.5 text-gray-600 text-xs">{u.email}</td>
                  <td className="px-5 py-3.5"><span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${roleStyle[u.roleId?.slug] || 'bg-gray-100 text-gray-700'}`}>{u.roleId?.name || u.roleId}</span></td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${u.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => { setEditingId(u._id); setForm({ firstName: u.firstName, lastName: u.lastName, email: u.email, password: '', roleId: u.roleId?._id || '' }); setShowForm(true); }}
                      className="text-blue-600 hover:underline text-xs font-semibold mr-3">Edit</button>
                    <button onClick={() => handleToggleStatus(u)}
                      className={`text-xs font-semibold hover:underline ${u.isActive ? 'text-orange-500' : 'text-green-500'}`}>
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="modal-box">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editingId ? 'Edit User' : 'Add User'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">First Name</label>
                  <input type="text" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last Name</label>
                  <input type="text" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{editingId ? 'New Password (leave blank to keep)' : 'Password'}</label>
                <input type="password" required={!editingId} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role</label>
                <select required value={form.roleId} onChange={(e) => setForm({ ...form, roleId: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm">
                  <option value="">Select role</option>
                  {roles.map((r: any) => <option key={r._id} value={r._id}>{r.name}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-all disabled:opacity-50">
                  {submitting ? 'Saving...' : editingId ? 'Update User' : 'Create User'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}