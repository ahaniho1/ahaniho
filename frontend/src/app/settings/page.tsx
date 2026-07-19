'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '', bio: '' });
  const [password, setPassword] = useState({ current: '', newPass: '', confirm: '' });
  const [notifs, setNotifs] = useState({ emailArticles: true, emailComments: true, digest: true, system: true });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    const user = localStorage.getItem('user');
    if (user) {
      const u = JSON.parse(user);
      setProfile({ firstName: u.firstName || '', lastName: u.lastName || '', email: u.email || '', bio: '' });
    }
    setLoading(false);
  }, []);

  const showMessage = (msg: string) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await fetch(`${API_URL}/users/${user._id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profile),
      });
      user.firstName = profile.firstName; user.lastName = profile.lastName; user.email = profile.email;
      localStorage.setItem('user', JSON.stringify(user));
      showMessage('Profile updated');
    } catch { showMessage('Failed to save'); }
    setSaving(false);
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.newPass !== password.confirm) { showMessage('Passwords do not match'); return; }
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: password.current, newPassword: password.newPass }),
      });
      const data = await res.json();
      if (data.error) showMessage(data.error);
      else { showMessage('Password updated'); setPassword({ current: '', newPass: '', confirm: '' }); }
    } catch { showMessage('Failed'); }
    setSaving(false);
  };

  const saveNotifs = () => { showMessage('Preferences saved'); };

  if (loading) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100vh' }}><p style={{color:'#94A3B8'}}>Loading...</p></div>;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'password', label: 'Password', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  ];

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px' }}>
        <a href="/dashboard" style={{ color: '#2563EB', fontSize: '13px', textDecoration: 'none', display: 'inline-block', marginBottom: '24px' }}>&larr; Back</a>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>Settings</h1>
        <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '32px' }}>Manage your account</p>

        {message && (
          <div style={{ background: '#ECFDF5', color: '#10B981', padding: '12px 18px', borderRadius: '12px', marginBottom: '24px', fontSize: '13px', fontWeight: 600, border: '1px solid #A7F3D0' }}>{message}</div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '32px', background: '#fff', borderRadius: '14px', padding: '4px', border: '1px solid #E2E8F0' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: '12px 16px', borderRadius: '11px', fontWeight: 600, fontSize: '13px',
                cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                background: activeTab === tab.id ? '#2563EB' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#64748B',
                transition: 'all 0.2s',
              }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={tab.icon}/></svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile */}
        {activeTab === 'profile' && (
          <form onSubmit={saveProfile} style={{ background: '#fff', borderRadius: '16px', padding: '32px', border: '1px solid #E2E8F0' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '24px' }}>Profile Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div><label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>First Name</label><input type="text" required value={profile.firstName} onChange={e => setProfile({...profile, firstName: e.target.value})} className="input" /></div>
              <div><label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Last Name</label><input type="text" required value={profile.lastName} onChange={e => setProfile({...profile, lastName: e.target.value})} className="input" /></div>
            </div>
            <div style={{ marginBottom: '16px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Email</label><input type="email" required value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="input" /></div>
            <div style={{ marginBottom: '24px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Bio</label><textarea rows={3} value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="textarea" placeholder="Tell us about yourself..." /></div>
            <button type="submit" disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : 'Save Profile'}</button>
          </form>
        )}

        {/* Password */}
        {activeTab === 'password' && (
          <form onSubmit={savePassword} style={{ background: '#fff', borderRadius: '16px', padding: '32px', border: '1px solid #E2E8F0' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '24px' }}>Change Password</h2>
            <div style={{ marginBottom: '16px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Current Password</label><input type="password" required value={password.current} onChange={e => setPassword({...password, current: e.target.value})} className="input" /></div>
            <div style={{ marginBottom: '16px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>New Password</label><input type="password" required value={password.newPass} onChange={e => setPassword({...password, newPass: e.target.value})} className="input" /></div>
            <div style={{ marginBottom: '24px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Confirm Password</label><input type="password" required value={password.confirm} onChange={e => setPassword({...password, confirm: e.target.value})} className="input" /></div>
            <button type="submit" disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : 'Update Password'}</button>
          </form>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', border: '1px solid #E2E8F0' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '24px' }}>Notification Preferences</h2>
            {[
              { key: 'emailArticles', label: 'Email for new articles' },
              { key: 'emailComments', label: 'Email for comments' },
              { key: 'digest', label: 'Weekly digest' },
              { key: 'system', label: 'System announcements' },
            ].map(item => (
              <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 0', borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}>
                <input type="checkbox" checked={(notifs as any)[item.key]} onChange={e => setNotifs({...notifs, [item.key]: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: '#2563EB' }} />
                <span style={{ fontSize: '14px', color: '#334155', fontWeight: 500 }}>{item.label}</span>
              </label>
            ))}
            <button onClick={saveNotifs} className="btn btn-primary" style={{ marginTop: '24px' }}>Save Preferences</button>
          </div>
        )}
      </div>
    </div>
  );
}