'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('Admin');
  const [stats, setStats] = useState({ articles: 0, views: 0, comments: 0, users: 0, pending: 0, ads: 0 });
  const [loading, setLoading] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    const u = localStorage.getItem('user');
    if (u) setUserName(JSON.parse(u).firstName || 'Admin');
    fetchStats();
    fetchMaintenanceStatus();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const [artRes, userRes, adRes] = await Promise.all([
        fetch(`${API_URL}/articles?limit=500`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/users`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/advertisements`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const artData = await artRes.json();
      const userData = await userRes.json();
      const adData = await adRes.json();
      const list = Array.isArray(artData) ? artData : artData?.articles || [];
      const users = Array.isArray(userData) ? userData : userData?.users || userData?.data || [];
      const ads = Array.isArray(adData) ? adData : [];
      setStats({
        articles: list.length,
        views: list.reduce((s: number, a: any) => s + (a.viewCount || 0), 0),
        comments: list.reduce((s: number, a: any) => s + (a.commentCount || 0), 0),
        users: users.length,
        pending: list.filter((a: any) => a.status === 'pending').length,
        ads: ads.filter((a: any) => a.status === 'active').length,
      });
    } catch {} finally { setLoading(false); }
  };

  const fetchMaintenanceStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/settings`);
      const data = await res.json();
      const settings = Array.isArray(data) ? data : [];
      const maintenance = settings.find((s: any) => s.key === 'maintenance_mode');
      if (maintenance) setMaintenanceMode(maintenance.value === true || maintenance.value === 'true');
    } catch {}
  };

  const toggleMaintenance = async () => {
    const newMode = !maintenanceMode;
    setMaintenanceMode(newMode);
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/settings/maintenance_mode`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ value: newMode }),
      });
    } catch {}
  };

  const quickActions = [
    { label: 'New Article', href: '/dashboard/articles', color: '#2563EB', bg: '#EFF6FF' },
    { label: 'Add User', href: '/dashboard/users', color: '#10B981', bg: '#ECFDF5' },
    { label: 'Create Task', href: '/dashboard/tasks', color: '#8B5CF6', bg: '#F5F3FF' },
    { label: 'New Ad', href: '/dashboard/ads', color: '#F59E0B', bg: '#FFFBEB' },
    { label: 'Analytics', href: '/dashboard/analytics', color: '#EC4899', bg: '#FDF2F8' },
    { label: 'Audit Logs', href: '/dashboard/audit-logs', color: '#64748B', bg: '#F1F5F9' },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', borderRadius: '20px', padding: '32px', border: '1px solid #BFDBFE', marginBottom: '24px' }}>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userName}</h1>
        <p className="text-gray-500 mt-1 text-sm">You have full control over the platform.</p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 180px', background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', borderRadius: '12px', padding: '16px 20px', border: '1px solid #BFDBFE' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform</p>
          <p style={{ fontSize: '18px', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>{maintenanceMode ? 'Maintenance' : 'Live'}</p>
        </div>
        <div style={{ flex: '1 1 180px', background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', borderRadius: '12px', padding: '16px 20px', border: '1px solid #A7F3D0' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending</p>
          <p style={{ fontSize: '18px', fontWeight: 800, color: '#F59E0B', marginTop: '4px' }}>{stats.pending}</p>
        </div>
        <div style={{ flex: '1 1 180px', background: 'linear-gradient(135deg, #FEF2F2, #FEE2E2)', borderRadius: '12px', padding: '16px 20px', border: '1px solid #FECACA' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Ads</p>
          <p style={{ fontSize: '18px', fontWeight: 800, color: '#2563EB', marginTop: '4px' }}>{stats.ads}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Articles', value: stats.articles }, { label: 'Views', value: stats.views },
          { label: 'Comments', value: stats.comments }, { label: 'Users', value: stats.users },
          { label: 'Pending', value: stats.pending },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <p className="stat-value">{loading ? '-' : s.value}</p>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold mb-4 text-gray-900">Quick Actions</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {quickActions.map(a => (
          <a key={a.label} href={a.href} className="card no-underline" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={a.color} strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>
            </div>
            <span className="text-sm font-semibold text-gray-700">{a.label}</span>
          </a>
        ))}
      </div>

      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 className="font-bold text-gray-900">Maintenance Mode</h3>
          <p className="text-sm text-gray-500">When enabled, only administrators can access the site.</p>
        </div>
        <button onClick={toggleMaintenance}
          style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', border: 'none',
            background: maintenanceMode ? '#10B981' : '#E2E8F0', color: maintenanceMode ? '#fff' : '#64748B' }}>
          {maintenanceMode ? '✓ Enabled' : 'Disabled'}
        </button>
      </div>
    </div>
  );
}