'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

function getYouTubeId(url: string) {
  if (!url) return '';
  if (url.includes('youtu.be/')) return url.split('youtu.be/')[1]?.split('?')[0] || '';
  if (url.includes('watch?v=')) return url.split('watch?v=')[1]?.split('&')[0] || '';
  if (url.includes('embed/')) return url.split('embed/')[1]?.split('?')[0] || '';
  if (url.includes('shorts/')) return url.split('shorts/')[1]?.split('?')[0] || '';
  return '';
}

function SidebarAd() {
  const [ad, setAd] = useState<any>(null);
  useEffect(() => {
    fetch(`${API_URL}/advertisements/active/sidebar`)
      .then(r => r.json()).then(data => { if (data && data._id) setAd(data); }).catch(() => {});
  }, []);
  if (!ad) return null;
  return (
    <div style={{ marginTop: '24px', background: '#fff', borderRadius: '14px', overflow: 'hidden', border: '1px solid #E2E8F0', position: 'relative' }}>
      {(ad.type === 'image' || ad.type === 'banner') && ad.imageUrl && (
        <img src={ad.imageUrl} alt={ad.title} style={{ width: '100%', objectFit: 'contain', background: '#F8FAFC' }} />
      )}
      {(ad.type === 'text' || ad.type === 'quick_info') && (
        <div style={{ padding: '16px', background: 'linear-gradient(135deg, #EFF6FF, #F8FAFC)' }}>
          <p style={{ fontWeight: 700, color: '#2563EB', fontSize: '14px' }}>{ad.title}</p>
          <p style={{ color: '#64748B', fontSize: '12px', marginTop: '4px' }}>{ad.content}</p>
        </div>
      )}
      {ad.whatsappNumber && (
        <div style={{ padding: '8px 12px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end' }}>
          <a href={`https://wa.me/${ad.whatsappNumber.replace(/\+/g,'')}`} target="_blank" rel="noopener"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#25D366', color: '#fff', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '11px', fontWeight: 600 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
            Message
          </a>
        </div>
      )}
      <span style={{ position: 'absolute', top: '6px', right: '10px', fontSize: '9px', color: '#94A3B8', background: 'rgba(255,255,255,0.9)', padding: '2px 6px', borderRadius: '4px' }}>Ad</span>
    </div>
  );
}

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [article, setArticle] = useState<any>(null);
  const [allArticles, setAllArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [commentForm, setCommentForm] = useState({ authorName: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

useEffect(() => {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
  setBookmarked(bookmarks.some((b: any) => b.slug === slug));
}, [slug]);

const toggleBookmark = () => {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
  if (bookmarked) {
    const updated = bookmarks.filter((b: any) => b.slug !== slug);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
    setBookmarked(false);
  } else {
    bookmarks.push({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      categoryId: article.categoryId,
      featuredImageUrl: article.featuredImageUrl,
      viewCount: article.viewCount,
      savedAt: new Date().toISOString(),
    });
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    setBookmarked(true);
  }
};

  useEffect(() => { if (slug) fetchArticle(); }, [slug]);

  const fetchArticle = async () => {
    try {
      const sessionId = localStorage.getItem('sessionId') || Math.random().toString(36).substring(2) + Date.now();
      localStorage.setItem('sessionId', sessionId);
      const [artRes, allRes] = await Promise.all([fetch(`${API_URL}/articles/${slug}`), fetch(`${API_URL}/articles?limit=20`)]);
      const data = await artRes.json();
      const allData = await allRes.json();
      const list = Array.isArray(allData) ? allData : allData?.articles || [];
      setArticle(data);
      setAllArticles(list.filter((a: any) => a.status === 'published' && a.slug !== slug));
      setLikeCount(data?.likeCount || 0);
      if (data?._id) {
        fetch(`${API_URL}/articles/${data._id}/view`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId }) });
        fetchComments(data._id);
      }
    } catch {} finally { setLoading(false); }
  };

  const fetchComments = async (articleId: string) => {
    try { const res = await fetch(`${API_URL}/comments?articleId=${articleId}`); const data = await res.json(); setComments(Array.isArray(data) ? data.filter((c: any) => c.status === 'visible') : []); } catch {}
  };

  const handleLike = async () => {
    if (!article) return;
    const fp = localStorage.getItem('deviceFingerprint') || Math.random().toString(36).substring(2) + Date.now();
    localStorage.setItem('deviceFingerprint', fp);
    const res = await fetch(`${API_URL}/articles/${article._id}/like`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ deviceFingerprint: fp }) });
    const data = await res.json(); setLikeCount(data.likeCount); setLiked(data.liked);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href; const text = article?.title || '';
    const links: Record<string, string> = { facebook: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}` };
    if (links[platform]) window.open(links[platform], '_blank'); else { navigator.clipboard.writeText(url); alert('Link copied!'); }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault(); if (!commentForm.authorName.trim() || !commentForm.content.trim()) return; setSubmitting(true);
    await fetch(`${API_URL}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ articleId: article._id, authorName: commentForm.authorName, content: commentForm.content }) });
    setCommentForm({ authorName: '', content: '' }); fetchComments(article._id); setSubmitting(false);
  };

  const getReadTime = (c: string) => c ? Math.max(1, Math.ceil(c.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)) + ' min read' : '1 min read';
  const getBadge = (s: string) => s === 'ai-training' ? 'badge-blue' : s === 'psychology-facts' ? 'badge-green' : 'badge-amber';
  const getBadgeClass = (s: string) => s === 'ai-training' ? 'badge-blue' : s === 'psychology-facts' ? 'badge-green' : 'badge-amber';
  const shouldTruncate = article?.content && article.content.replace(/<[^>]*>/g, '').length > 800;
  const recommended = allArticles.slice(0, 5);
  const related = allArticles.slice(5, 9);

  if (loading) return <div className="container py-20 text-center text-gray-400">Loading...</div>;
  if (!article) return <div className="container py-20 text-center text-gray-400">Article not found.</div>;

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      <div className="container py-8">
        <Link href="/articles" className="text-blue-600 text-sm hover:underline mb-4 inline-block">&larr; Back to Articles</Link>
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 700px', maxWidth: '760px', minWidth: 0 }}>
            {article.videoUrl && (
              <div className="video-wrapper">
                {article.videoType === 'youtube' ? <iframe src={`https://www.youtube.com/embed/${getYouTubeId(article.videoUrl)}`} allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" title={article.title} /> : <video src={article.videoUrl} controls />}
              </div>
            )}
            {article.featuredImageUrl && !article.videoUrl && <img src={article.featuredImageUrl} alt={article.title} className="article-featured-img" />}
            <span className={`badge ${getBadge(article.categoryId?.slug || '')}`}><span className="badge-dot"></span>{article.categoryId?.name || 'General'}</span>
            <h1 className="text-3xl md:text-4xl font-extrabold mt-3 mb-4 leading-tight" style={{color:'#0F172A'}}>{article.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-6 pb-4 border-b">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-xs text-blue-600">{article.authorId?.firstName?.[0] || 'A'}</div>
              <span className="font-semibold text-gray-900">{article.authorId?.firstName || 'AHA NIHO'} {article.authorId?.lastName || ''}</span>
              <span>&middot;</span><span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently'}</span>
              <span>&middot;</span><span>{getReadTime(article.content)}</span><span>&middot;</span><span>{article.viewCount || 0} views</span>
              <div className="flex items-center gap-4 ml-auto">
                <button onClick={handleLike} className={`flex items-center gap-1.5 font-semibold transition-colors ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}><svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>{likeCount}</button>
                <button onClick={toggleBookmark} className={`flex items-center gap-1.5 font-semibold transition-colors ${bookmarked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
              {bookmarked ? 'Saved' : 'Save'}
            </button>
            <button onClick={() => handleShare('copy')} className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 font-semibold"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Share</button>
              </div>
            </div>
            <div className="article-content" style={{background:'#fff',borderRadius:'16px',padding:'32px',border:'1px solid #E2E8F0',marginBottom:'24px'}}>
              {expanded || !shouldTruncate ? <div dangerouslySetInnerHTML={{ __html: article.content || '<p>No content available.</p>' }} /> :
                <><div dangerouslySetInnerHTML={{ __html: article.content?.substring(0, article.content.indexOf('</p>', 800) + 4) || article.content }} />
                  <div style={{ position: 'relative', marginTop: '-60px', paddingTop: '60px', background: 'linear-gradient(transparent, white 40%, white)' }}>
                    <button onClick={() => setExpanded(true)} className="btn btn-primary btn-sm" style={{display:'block',margin:'16px auto 0'}}>Show More ↓</button>
                  </div></>}
              {article.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t">
                  {article.tags.map((t: string) => <Link key={t} href={`/search?q=${encodeURIComponent(t)}`} className="badge badge-blue" style={{fontSize:'11px',cursor:'pointer',textDecoration:'none'}}>{t}</Link>)}
                </div>
              )}
            </div>
            {!expanded && related.length > 0 && (
              <div style={{marginBottom:'24px'}}><h3 className="text-lg font-bold mb-4">Related Articles</h3>
                <div className="space-y-2">{related.map((a: any) => (
                  <Link key={a._id} href={`/articles/${a.slug}`} className="article-row">
                    <div className="article-row-thumb" style={{width:'100px',height:'65px'}}>{a.featuredImageUrl ? <img src={a.featuredImageUrl} alt={a.title} /> : <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',background:'#F1F5F9'}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>}</div>
                    <div className="article-row-info"><span className={`badge ${getBadgeClass(a.categoryId?.slug || '')}`} style={{fontSize:'10px',padding:'2px 8px'}}><span className="badge-dot"></span>{a.categoryId?.name || 'General'}</span><h3 className="text-xs font-bold mt-1 line-clamp-1">{a.title}</h3><span className="text-xs text-gray-400">{a.viewCount || 0} views</span></div>
                  </Link>
                ))}</div>
              </div>
            )}
            <div style={{background:'#fff',borderRadius:'16px',padding:'32px',border:'1px solid #E2E8F0'}}>
              <h3 className="text-xl font-bold mb-6">Comments ({comments.length})</h3>
              <form onSubmit={handleComment} className="mb-8 space-y-3">
                <input type="text" required placeholder="Your name" value={commentForm.authorName} onChange={e => setCommentForm({...commentForm, authorName: e.target.value})} className="input" />
                <textarea required rows={3} placeholder="Write your comment..." value={commentForm.content} onChange={e => setCommentForm({...commentForm, content: e.target.value})} className="textarea" />
                <button type="submit" disabled={submitting} className="btn btn-primary">{submitting ? 'Posting...' : 'Post Comment'}</button>
              </form>
              {comments.length === 0 ? <p className="text-gray-400 text-sm py-4">No comments yet. Be the first to share your thoughts.</p> :
                <div className="space-y-3">{comments.map((c: any) => (
                  <div key={c._id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2"><div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center font-bold text-xs text-gray-600">{c.authorName?.[0]?.toUpperCase()}</div><div><p className="font-semibold text-sm">{c.authorName}</p><p className="text-xs text-gray-400">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}</p></div></div>
                    <p className="text-gray-700 text-sm">{c.content}</p>
                  </div>
                ))}</div>
              }
            </div>
          </div>
          <div style={{ flex: '0 0 300px' }} className="hidden lg:block">
            <div style={{ position: 'sticky', top: '80px' }}>
              <h3 className="text-lg font-bold mb-4">Recommended</h3>
              <div className="space-y-3">
                {recommended.map((a: any) => (
                  <Link key={a._id} href={`/articles/${a.slug}`} className="card" style={{padding:'14px',display:'flex',gap:'12px',alignItems:'center'}}>
                    <div style={{width:'180px',height:'120px',borderRadius:'10px',overflow:'hidden',flexShrink:0,background:'#F1F5F9'}}>{a.featuredImageUrl ? <img src={a.featuredImageUrl} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} /> : <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%'}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="3"/></svg></div>}</div>
                    <div style={{minWidth:0}}><span className={`badge ${getBadgeClass(a.categoryId?.slug || '')}`} style={{fontSize:'12px',padding:'4px 10px'}}><span className="badge-dot"></span>{a.categoryId?.name || 'General'}</span><h3 className="text-lg font-bold mt-2 line-clamp-2">{a.title}</h3><span className="text-xs text-gray-400">{a.viewCount || 0} views</span></div>
                  </Link>
                ))}
              </div>
              <SidebarAd />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}