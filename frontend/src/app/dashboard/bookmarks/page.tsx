'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setBookmarks(saved);
  }, []);

  const removeBookmark = (slug: string) => {
    const updated = bookmarks.filter((b: any) => b.slug !== slug);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
    setBookmarks(updated);
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Bookmarks</h1>
      <p className="text-gray-500 text-sm mb-8">Articles you have saved for later</p>

      {bookmarks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '64px' }}>
          <p className="text-gray-500">No bookmarks yet.</p>
          <p className="text-gray-400 text-sm mt-1">Save articles by clicking the bookmark icon on any article.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {bookmarks.map((b: any) => (
            <div key={b.slug} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}>
              <Link href={`/articles/${b.slug}`} style={{ flex: 1, textDecoration: 'none', color: 'inherit' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {b.featuredImageUrl ? (
                    <img src={b.featuredImageUrl} alt="" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '40px', height: '40px', borderRadius: '6px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{b.title}</p>
                    <span className="text-xs text-gray-400 mt-1">{b.savedAt ? new Date(b.savedAt).toLocaleDateString() : ''}</span>
                  </div>
                </div>
              </Link>
              <button onClick={() => removeBookmark(b.slug)} style={{ padding: '6px 12px', background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}