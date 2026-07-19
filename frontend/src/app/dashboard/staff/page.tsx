'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function StaffDashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('Staff');
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    const u = localStorage.getItem('user');
    if (u) setUserName(JSON.parse(u).firstName || 'Staff');
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/tasks`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.tasks || data?.data || [];
      setTasks(list);
    } catch {} finally { setLoading(false); }
  };

  const updateTaskStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      fetchTasks();
    } catch {}
  };

  const stats = {
    total: tasks.length,
    inProgress: tasks.filter((t: any) => t.status === 'in_progress').length,
    completed: tasks.filter((t: any) => t.status === 'completed').length,
    pending: tasks.filter((t: any) => t.status === 'pending').length,
  };

  const priorityStyle: Record<string, string> = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-gray-100 text-gray-700',
    urgent: 'bg-red-200 text-red-800',
  };

  const statusStyle: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Welcome */}
      <div style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', borderRadius: '20px', padding: '32px', border: '1px solid #BFDBFE', marginBottom: '32px' }}>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {userName}</h1>
        <p className="text-gray-500 mt-1 text-sm">Your assigned tasks are listed below. Keep up the great work.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total Tasks', value: stats.total },
          { label: 'Pending', value: stats.pending },
          { label: 'In Progress', value: stats.inProgress },
          { label: 'Completed', value: stats.completed },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ textAlign: 'center' }}>
            <p className="stat-value" style={{ fontSize: '1.8rem' }}>{loading ? '-' : s.value}</p>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tasks List */}
      <h2 className="text-lg font-bold mb-4 text-gray-900">My Tasks</h2>
      {loading ? (
        <div className="text-gray-400 text-sm py-8 text-center">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <p className="text-gray-500 text-sm">No tasks assigned yet.</p>
          <p className="text-gray-400 text-xs mt-1">Tasks assigned to you by the administrator will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task: any) => (
            <div key={task._id} className="card" style={{ padding: '20px' }}>
              <div className="flex items-start justify-between mb-3 flex-wrap gap-3">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    <span className={`badge ${priorityStyle[task.priority] || 'bg-gray-100 text-gray-700'}`} style={{ fontSize: '10px' }}>{task.priority}</span>
                    <span className={`badge ${statusStyle[task.status] || 'bg-gray-100 text-gray-700'}`} style={{ fontSize: '10px' }}>{task.status?.replace('_', ' ')}</span>
                  </div>
                  {task.description && <p className="text-gray-500 text-sm mt-1">{task.description}</p>}
                  {task.dueDate && <p className="text-xs text-gray-400 mt-2">Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${task.progressPercentage || 0}%` }}></div>
              </div>
              <p className="text-xs text-gray-400 text-right mb-3">{task.progressPercentage || 0}%</p>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                {task.status === 'pending' && (
                  <button onClick={() => updateTaskStatus(task._id, 'in_progress')} className="btn btn-primary btn-sm">Start Work</button>
                )}
                {task.status === 'in_progress' && (
                  <button onClick={() => updateTaskStatus(task._id, 'completed')} className="btn btn-sm" style={{ background: '#10B981', color: '#fff' }}>Mark Complete</button>
                )}
                {task.status !== 'completed' && task.status !== 'cancelled' && (
                  <button onClick={() => updateTaskStatus(task._id, 'cancelled')} className="btn btn-ghost btn-sm text-red-500">Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}