'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function PublisherDashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('Publisher');
  const [stats, setStats] = useState({ total: 0, published: 0, pending: 0, draft: 0, views: 0, likes: 0 });
  const [myArticles, setMyArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    const u = localStorage.getItem('user');
    if (u) setUserName(JSON.parse(u).firstName || 'Publisher');
    fetchMyData();
  }, []);

  const fetchMyData = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const res = await fetch(`${API_URL}/articles?limit=500`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.articles || [];
      const mine = list.filter((a: any) => a.authorId?._id === user._id || a.authorId === user._id);
      setMyArticles(mine.slice(0, 10));
      setStats({
        total: mine.length,
        published: mine.filter((a: any) => a.status === 'published').length,
        pending: mine.filter((a: any) => a.status === 'pending').length,
        draft: mine.filter((a: any) => a.status === 'draft').length,
        views: mine.reduce((s: number, a: any) => s + (a.viewCount || 0), 0),
        likes: mine.reduce((s: number, a: any) => s + (a.likeCount || 0), 0),
      });
    } catch {} finally { setLoading(false); }
  };

  const statusStyle: Record<string, string> = {
    published: 'bg-green-100 text-green-700',
    pending: 'bg-amber-100 text-amber-700',
    draft: 'bg-gray-100 text-gray-700',
    rejected: 'bg-red-100 text-red-700',
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Welcome */}
      <div style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', borderRadius: '20px', padding: '32px', border: '1px solid #BFDBFE', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {userName}</h1>
            <p className="text-gray-500 mt-1 text-sm">Manage your articles and track performance here.</p>
          </div>
          <Link href="/dashboard/articles" className="btn btn-primary">+ New Article</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-8">
        {[
          { label: 'Total', value: stats.total },
          { label: 'Published', value: stats.published },
          { label: 'Pending', value: stats.pending },
          { label: 'Drafts', value: stats.draft },
          { label: 'Views', value: stats.views },
          { label: 'Likes', value: stats.likes },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ textAlign: 'center' }}>
            <p className="stat-value" style={{ fontSize: '1.8rem' }}>{loading ? '-' : s.value}</p>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* My Articles */}
      <h2 className="text-lg font-bold mb-4 text-gray-900">My Recent Articles</h2>
      {loading ? (
        <div className="text-gray-400 text-sm py-8 text-center">Loading...</div>
      ) : myArticles.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <p className="text-gray-500 text-sm">No articles yet.</p>
          <Link href="/dashboard/articles" className="btn btn-primary btn-sm mt-4">Create Your First Article</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {myArticles.map((a: any) => (
            <div key={a._id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 className="font-semibold text-sm text-gray-900 truncate">{a.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{a.categoryId?.name || 'General'} &middot; {a.viewCount || 0} views &middot; {a.likeCount || 0} likes</p>
              </div>
              <span className={`badge ${statusStyle[a.status] || 'bg-gray-100 text-gray-700'}`} style={{ fontSize: '11px' }}>{a.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}