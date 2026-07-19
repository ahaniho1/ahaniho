'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchArticles(); }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch(`${API_URL}/articles?limit=50`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.articles || [];
      setArticles(list.filter((a: any) => a.status === 'published'));
    } catch {} finally { setLoading(false); }
  };

  const getBadge = (slug: string) => {
    const m: Record<string, string> = { 'ai-training': 'badge-blue', 'psychology-facts': 'badge-green', 'financial-literacy': 'badge-amber' };
    return m[slug] || 'badge-blue';
  };
  const getReadTime = (c: string) => c ? Math.max(1, Math.ceil(c.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)) + ' min read' : '1 min read';

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      <section style={{ background: 'linear-gradient(135deg, #EFF6FF, #F8FAFC)', padding: '48px 0', textAlign: 'center' }}>
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">All Articles</h1>
          <p className="text-gray-500">Explore our latest published content across all categories</p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          {loading ? (
            <div className="empty-state"><div className="empty-state-icon">⌛</div><p className="empty-state-title">Loading articles...</p></div>
          ) : articles.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div>
              <p className="empty-state-title">No articles yet</p><p className="empty-state-desc">Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 stagger">
              {articles.map((a: any) => (
                <Link key={a._id} href={`/articles/${a.slug}`} className="article-row" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'stretch' }}>
  <div>
    <span className={`badge ${getBadge(a.categoryId?.slug || '')}`} style={{fontSize:'10px',padding:'2px 8px'}}><span className="badge-dot"></span>{a.categoryId?.name || 'General'}</span>
    <h3 className="text-xl font-bold mt-2 mb-0 leading-snug">{a.title}</h3>
  </div>
  <div className="article-row-thumb" style={{width:'360px',height:'230px'}}>
    {a.featuredImageUrl ? <img src={a.featuredImageUrl} alt={a.title} /> :
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',background:'#F1F5F9'}}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
      </div>}
  </div>
  <div>
    <p className="text-gray-500 text-xs line-clamp-2 mb-2">{a.excerpt || 'Read more...'}</p>
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <span>{getReadTime(a.content)}</span><span>&middot;</span>
      <span>{a.viewCount || 0} views</span><span>&middot;</span>
      <span>{a.likeCount || 0} likes</span>
    </div>
  </div>
</Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}