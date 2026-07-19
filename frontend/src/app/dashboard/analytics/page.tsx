'use client';
import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function DashboardAnalyticsPage() {
  return <AnalyticsContent />;
}

function AnalyticsContent() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/analytics/summary`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setData(d || { daily:{}, weekly:{}, monthly:{}, totals:{}, topArticles:[] }))
      .catch(() => setData({ daily:{}, weekly:{}, monthly:{}, totals:{}, topArticles:[] }));
  }, []);

  if (!data) {
    return <div style={{ padding:'48px', textAlign:'center', color:'#94A3B8' }}>Loading analytics...</div>;
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h1>
      <p className="text-gray-500 text-sm mb-8">Platform performance metrics</p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Views Today', value: data.daily?.views || 0 },
          { label: 'Views This Week', value: data.weekly?.views || 0 },
          { label: 'Views This Month', value: data.monthly?.views || 0 },
          { label: 'Total Views', value: data.totals?.views || 0 },
          { label: 'Total Articles', value: data.totals?.articles || 0 },
          { label: 'Total Comments', value: data.totals?.comments || 0 },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <p className="stat-value">{s.value.toLocaleString()}</p>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="card">
        <h2 className="text-lg font-bold mb-4 text-gray-900">Top Articles</h2>
        {!data.topArticles?.length ? (
          <p className="text-gray-400 text-sm py-4">No data yet.</p>
        ) : (
          <div className="space-y-2">
            {data.topArticles.map((a: any, i: number) => (
              <div key={a._id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid #F1F5F9' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <span style={{ fontWeight:800, color:'#2563EB', fontSize:'18px' }}>#{i+1}</span>
                  <div><p className="font-semibold text-sm text-gray-900">{a.title}</p><p className="text-xs text-gray-400">{a.categoryId?.name || 'General'}</p></div>
                </div>
                <div style={{ display:'flex', gap:'16px', fontSize:'13px', color:'#64748B' }}><span>{a.viewCount||0} views</span><span>{a.likeCount||0} likes</span></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}