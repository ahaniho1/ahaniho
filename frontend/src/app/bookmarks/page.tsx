'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    const load = () => {
      const saved = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      setBookmarks(saved);
    };
    load();
    window.addEventListener('focus', load);
    return () => window.removeEventListener('focus', load);
  }, []);

  const removeBookmark = (slug: string) => {
    const updated = bookmarks.filter((b: any) => b.slug !== slug);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
    setBookmarks(updated);
  };

  const getBadge = (s: string) => {
    const m: Record<string, string> = { 'ai-trends': 'badge-ai-trends', 'real-and-fact': 'badge-real-and-fact', 'finewave': 'badge-finewave', 'bonus': 'badge-bonus' };
    return m[s] || 'badge-ai-trends';
  };

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      <section style={{ background: 'linear-gradient(135deg, #EFF6FF, #F8FAFC)', padding: '48px 0 32px', textAlign: 'center' }}>
        <div className="container">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">My Bookmarks</h1>
          <p className="text-gray-500">Articles you have saved for later</p>
        </div>
      </section>
      <section style={{ padding: '32px 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          {bookmarks.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '64px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔖</div>
              <p className="text-gray-500 font-medium">No bookmarks yet</p>
              <p className="text-gray-400 text-sm mt-1">Browse articles and click the bookmark icon to save them here.</p>
              <Link href="/articles" className="btn btn-primary btn-sm" style={{ marginTop: '16px', display: 'inline-block' }}>Browse Articles</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarks.map((b: any) => (
                <div key={b.slug} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px' }}>
                  {b.featuredImageUrl ? (
                    <img src={b.featuredImageUrl} alt="" style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '80px', height: '60px', borderRadius: '8px', background: '#F1F5F9', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link href={`/articles/${b.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <span className={`badge ${getBadge(b.categoryId?.slug || '')}`} style={{ fontSize: '10px', marginBottom: '4px' }}><span className="badge-dot"></span>{b.categoryId?.name || 'General'}</span>
                      <h3 className="font-bold text-sm mt-1">{b.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">{b.savedAt ? new Date(b.savedAt).toLocaleDateString() : ''}</p>
                    </Link>
                  </div>
                  <button onClick={() => removeBookmark(b.slug)} className="btn btn-ghost btn-sm" style={{ color: '#EF4444', flexShrink: 0 }}>Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}