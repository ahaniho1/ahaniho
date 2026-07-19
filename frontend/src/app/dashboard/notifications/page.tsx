'use client';
import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function DashboardNotificationsPage() {
  const [notifs, setNotifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/notifications`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setNotifs(Array.isArray(d) ? d : [])).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/notifications/mark-all-read`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
    setNotifs(notifs.map(n => ({ ...n, isRead: true })));
  };

  if (loading) return <div style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>Loading...</div>;

  return (
    <div className="p-6 lg:p-8">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 text-sm">System alerts and updates</p>
        </div>
        {notifs.some((n: any) => !n.isRead) && (
          <button onClick={markAllRead} className="btn btn-ghost btn-sm text-blue-600">Mark all read</button>
        )}
      </div>
      {notifs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '64px' }}>
          <p className="text-gray-500">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifs.map((n: any) => (
            <div key={n._id} className="card" style={{ padding: '16px 20px', opacity: n.isRead ? 0.5 : 1, display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.isRead ? '#E2E8F0' : '#2563EB', marginTop: '6px', flexShrink: 0 }}></span>
              <div style={{ flex: 1 }}>
                <p className="font-semibold text-sm text-gray-900">{n.title}</p>
                <p className="text-gray-500 text-sm mt-1">{n.message}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}