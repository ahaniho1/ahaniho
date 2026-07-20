'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

function SearchContent() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(urlQuery);
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (urlQuery.trim()) { setQuery(urlQuery); handleSearchDirect(urlQuery); } }, [urlQuery]);

  const handleSearchDirect = async (q: string) => {
    setLoading(true); setSearched(true);
    try {
      const res = await fetch(`${API_URL}/articles?limit=50`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.articles || [];
      const ql = q.toLowerCase().trim();
      setResults(list.filter((a: any) => {
        if (a.status !== 'published') return false;
        const s = [a.title||'', a.excerpt||'', a.categoryId?.name||'', ...(a.tags||[])].join(' ').toLowerCase();
        return ql.split(/\s+/).every((w: string) => s.includes(w));
      }));
    } catch {} finally { setLoading(false); }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true); setSearched(true);
    try {
      const res = await fetch(`${API_URL}/articles?limit=50`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.articles || [];
      const ql = query.toLowerCase().trim();
      setResults(list.filter((a: any) => {
        if (a.status !== 'published') return false;
        const s = [a.title||'', a.excerpt||'', a.categoryId?.name||'', ...(a.tags||[])].join(' ').toLowerCase();
        return ql.split(/\s+/).every((w: string) => s.includes(w));
      }));
    } catch {} finally { setLoading(false); }
  };

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      <section style={{ background: 'linear-gradient(135deg, #EFF6FF, #F8FAFC)', padding: '40px 0 32px', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Search Articles</h1>
          <p className="text-gray-500 mb-8">Find content across all categories</p>
          <form onSubmit={handleSearch} className="search-box" style={{ margin: '0 auto' }}>
            <input type="text" placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} />
            <button type="submit" style={{ background: '#2563EB', color: '#fff', border: 'none', padding: '16px 24px', fontWeight: 600, cursor: 'pointer', borderRadius: '0 14px 14px 0' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </button>
          </form>
        </div>
      </section>
      <section style={{ padding: '32px 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          {loading ? (
            <div className="empty-state"><div className="empty-state-icon">⌛</div><p className="empty-state-title">Searching...</p></div>
          ) : searched && results.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg></div>
              <p className="empty-state-title">No results found for &quot;{query}&quot;</p>
              <p className="empty-state-desc">Try different keywords or browse categories.</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((a: any) => (
                <Link key={a._id} href={`/articles/${a.slug}`} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px' }}>
                  <div><span className="badge badge-blue"><span className="badge-dot"></span>{a.categoryId?.name || 'General'}</span><h3 className="font-bold mt-1">{a.title}</h3></div>
                  <div style={{ width: '100%', height: '180px', borderRadius: '10px', overflow: 'hidden', background: '#F1F5F9' }}>
                    {a.featuredImageUrl ? <img src={a.featuredImageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>}
                  </div>
                  <div><p className="text-gray-500 text-sm">{a.excerpt || 'Read more...'}</p></div>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}