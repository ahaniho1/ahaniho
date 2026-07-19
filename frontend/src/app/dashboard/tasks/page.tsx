'use client';
import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function DashboardTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '', status: 'pending' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchTasks(); fetchUsers(); }, []);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : data?.tasks || data?.data || []);
    } catch {}
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setUsers(data || []);
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const url = editingId ? `${API_URL}/tasks/${editingId}` : `${API_URL}/tasks`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save task');
      setShowForm(false); setEditingId(null);
      setForm({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '', status: 'pending' });
      fetchTasks();
    } catch (err: any) { setError(err.message); }
    setSubmitting(false);
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this task?')) return;
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      fetchTasks();
    } catch {}
  };

  const priorityStyle: Record<string, string> = {
    high: 'bg-red-100 text-red-700', medium: 'bg-orange-100 text-orange-700',
    low: 'bg-gray-100 text-gray-700', urgent: 'bg-red-200 text-red-800',
  };
  const statusStyle: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-700', in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700',
  };

  if (loading) return <div className="p-8 flex items-center justify-center"><div className="text-gray-400">Loading tasks...</div></div>;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold">Tasks</h1><p className="text-gray-500 text-sm">Create and manage staff tasks</p></div>
        <button onClick={() => { setEditingId(null); setForm({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '', status: 'pending' }); setShowForm(true); }}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all">+ New Task</button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-xs">Task</th>
              <th className="text-left px-5 py-3 font-semibold text-xs">Assigned To</th>
              <th className="text-left px-5 py-3 font-semibold text-xs">Priority</th>
              <th className="text-left px-5 py-3 font-semibold text-xs">Status</th>
              <th className="text-left px-5 py-3 font-semibold text-xs">Due</th>
              <th className="text-left px-5 py-3 font-semibold text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400">No tasks created yet.</td></tr>
            ) : (
              tasks.map((t: any) => (
                <tr key={t._id} className="border-t hover:bg-gray-50">
                  <td className="px-5 py-3.5 font-medium">{t.title}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-600">{t.assignedTo?.firstName || '-'} {t.assignedTo?.lastName || ''}</td>
                  <td className="px-5 py-3.5"><span className={`text-[11px] px-2 py-0.5 rounded-full font-bold uppercase ${priorityStyle[t.priority]}`}>{t.priority}</span></td>
                  <td className="px-5 py-3.5"><span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${statusStyle[t.status]}`}>{t.status?.replace('_', ' ')}</span></td>
                  <td className="px-5 py-3.5 text-xs text-gray-500">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-'}</td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => { setEditingId(t._id); setForm({ title: t.title, description: t.description || '', assignedTo: t.assignedTo?._id || '', priority: t.priority, dueDate: t.dueDate?.split('T')[0] || '', status: t.status }); setShowForm(true); }}
                      className="text-blue-600 hover:underline text-xs font-semibold mr-3">Edit</button>
                    <button onClick={() => handleCancel(t._id)} className="text-red-500 hover:underline text-xs font-semibold">Cancel</button>
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
              <h2 className="text-xl font-bold">{editingId ? 'Edit Task' : 'New Task'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
                <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Assign To</label>
                  <select value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm">
                    <option value="">Select user</option>
                    {users.map((u: any) => <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Priority</label>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm">
                    <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Due Date</label>
                  <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm">
                    <option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-all disabled:opacity-50">
                  {submitting ? 'Saving...' : editingId ? 'Update Task' : 'Create Task'}
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