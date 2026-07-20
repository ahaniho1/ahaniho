'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function RealStats() {
  const [stats, setStats] = useState({ articles: 0, categories: 0 });

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    Promise.all([
      fetch(`${API_URL}/articles?limit=1`).then(r => r.json()),
      fetch(`${API_URL}/categories`).then(r => r.json()),
    ]).then(([artData, catData]) => {
      const total = artData?.total || (Array.isArray(artData) ? artData.length : artData?.articles?.length || 0);
      const cats = Array.isArray(catData) ? catData.length : 0;
      setStats({ articles: total, categories: cats });
    }).catch(() => {});
  }, []);

  return (
    <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginTop: '40px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
      <span>{stats.articles}+ Articles</span>
      <span>{stats.categories} Categories</span>
      <span>Free Forever</span>
    </div>
  );
}
export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      const endpoint = isLogin ? 'auth/login' : 'auth/register';
      const body = isLogin
        ? JSON.stringify({ email: form.email, password: form.password })
        : JSON.stringify({ name: form.name, email: form.email, password: form.password });

      const res = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body,
      });
      const data = await res.json();
      if (data.error) { setError(data.error); setLoading(false); return; }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      document.cookie = `token=${data.token}; path=/; max-age=604800`;
      const role = data.user.role;
      if (role === 'administrator') router.push('/dashboard/admin');
      else if (role === 'publisher') router.push('/dashboard/publisher');
      else if (role === 'service_staff') router.push('/dashboard/staff');
      else router.push('/');
    } catch { setError('Cannot connect to server.'); setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F8FAFC' }}>
      
      {/* Left — Brand Side */}
      <div className="hidden md:flex" style={{ flex: '1', background: 'linear-gradient(160deg, #1E293B 0%, #312E81 100%)', alignItems: 'center', justifyContent: 'center', padding: '48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(37,99,235,0.15)', filter: 'blur(60px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(139,92,246,0.1)', filter: 'blur(60px)' }}></div>
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#fff', maxWidth: '400px' }}>
          <Link href="/" style={{ display: 'inline-block', marginBottom: '32px' }}>
            <img src="/logo.png" alt="Aha Secret Max" style={{ height: '70px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
          </Link>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.02em' }}>Secrets That Elevate You</h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
            Discover expert articles on AI Training, Psychology Facts, and Financial Literacy. Your journey to smarter decisions starts here.
          </p>
            <RealStats />
        </div>
      </div>

      {/* Right — Form */}
      <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 32px' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          
          {/* Tabs */}
          <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: '12px', padding: '4px', marginBottom: '32px' }}>
            <button onClick={() => setIsLogin(true)}
              style={{ flex: 1, padding: '11px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', border: 'none', background: isLogin ? '#fff' : 'transparent', color: isLogin ? '#0F172A' : '#64748B', transition: 'all 0.2s', boxShadow: isLogin ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>
              Sign In
            </button>
            <button onClick={() => setIsLogin(false)}
              style={{ flex: 1, padding: '11px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', border: 'none', background: !isLogin ? '#fff' : 'transparent', color: !isLogin ? '#0F172A' : '#64748B', transition: 'all 0.2s', boxShadow: !isLogin ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>
              Create Account
            </button>
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>{isLogin ? 'Welcome back' : 'Join Aha Secret Max'}</h2>
          <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '28px' }}>{isLogin ? 'Sign in to access your dashboard' : 'Create a free reader account'}</p>

          {error && (
            <div style={{ background: '#FEF2F2', color: '#EF4444', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px', border: '1px solid #FECACA' }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {!isLogin && (
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Full Name</label>
                <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input" placeholder="Jean Paul" />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Email</label>
              <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input" placeholder="you@example.com" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} required value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="input" placeholder="••••••••" style={{ paddingRight: '50px' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: '11px', fontWeight: 700, color: '#64748B', cursor: 'pointer' }}>
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ marginTop: '8px', padding: '14px', background: '#2563EB', color: '#fff', borderRadius: '12px', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer', transition: 'all 0.2s', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#94A3B8', marginTop: '24px' }}>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
              {isLogin ? 'Create one' : 'Sign in'}
            </button>
          </p>

          <p style={{ textAlign: 'center', fontSize: '11px', color: '#94A3B8', marginTop: '32px' }}>
            Publisher or Staff accounts are created by administrators.
          </p>
        </div>
      </div>

    </div>
  );
}