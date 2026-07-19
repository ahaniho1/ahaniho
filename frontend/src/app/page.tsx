'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
function AdsTicker() {
  const [ads, setAds] = useState<any[]>([]);
  useEffect(() => {
    fetch(`${API_URL}/advertisements/active`)
      .then(r => r.json()).then(d => setAds(Array.isArray(d) ? d.slice(0, 5) : [])).catch(() => {});
  }, []);
  if (!ads.length) return null;
  return (
    <div style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', padding: '8px 0', overflow: 'hidden', borderBottom: '1px solid #BFDBFE' }}>
      <div style={{ display: 'flex', gap: '48px', animation: 'marquee 25s linear infinite', width: 'max-content', padding: '0 24px' }}>
        {[...ads, ...ads].map((ad, i) => (
          <span key={i} style={{ fontSize: '12px', fontWeight: 600, color: '#2563EB', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563EB' }}></span>
            {ad.title}
          </span>
        ))}
      </div>
    </div>
  );
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

function ClientCTA() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => { setLoggedIn(!!localStorage.getItem('token')); }, []);
  if (loggedIn) return <Link href="/articles" className="btn btn-white btn-lg">Explore Articles</Link>;
  return <Link href="/login" className="btn btn-white btn-lg">Get Started Free</Link>;
}

function RotatingCard() {
  const cards = [
    { label: 'AI Training', sub: 'Master Machine Learning & Deep Learning', href: '/categories/ai-training', color: '#2563EB', bg: '#EFF6FF' },
    { label: 'Psychology Facts', sub: 'Understand Human Behavior & Cognitive Science', href: '/categories/psychology-facts', color: '#10B981', bg: '#ECFDF5' },
    { label: 'Financial Literacy', sub: 'Build Wealth & Master Personal Finance', href: '/categories/financial-literacy', color: '#F59E0B', bg: '#FFFBEB' },
    { label: 'Wealth Building', sub: 'Strategic Investing & Income Growth', href: '/search?q=wealth+building', color: '#8B5CF6', bg: '#F5F3FF' },
  ];
  const [current, setCurrent] = useState(0);
  const [exiting, setExiting] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setExiting(true);
      setTimeout(() => { setCurrent((prev) => (prev + 1) % cards.length); setExiting(false); }, 400);
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  const card = cards[current];
  return (
    <div style={{ flex: '1 1 340px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Link href={card.href} className={exiting ? 'quick-action exit' : 'quick-action enter'}
        style={{ background: card.bg, borderRadius: '24px', padding: '40px 32px', textDecoration: 'none', color: card.color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', textAlign: 'center', border: `2px solid ${card.color}30`, width: '100%', maxWidth: '340px', minHeight: '220px', cursor: 'pointer' }}>
        <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: card.color }}></span>
        <span style={{ fontSize: '22px', fontWeight: 800 }}>{card.label}</span>
        <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>{card.sub}</span>
      </Link>
    </div>
  );
}

function AdBanner({ position }: { position: string }) {
  const [ad, setAd] = useState<any>(null);
  useEffect(() => {
    fetch(`${API_URL}/advertisements/active/${position}`)
      .then(r => r.json()).then(data => { if (data && data._id) setAd(data); }).catch(() => {});
  }, []);
  if (!ad) return null;

  return (
    <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E2E8F0', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {(ad.type === 'image' || ad.type === 'banner') && ad.imageUrl && (
        <img src={ad.imageUrl} alt={ad.title} style={{ width: '100%', height: '200px', objectFit: 'cover', background: '#F8FAFC' }} />
      )}
      {(ad.type === 'text' || ad.type === 'quick_info') && (
        <div style={{ padding: '14px 16px', background: 'linear-gradient(135deg, #EFF6FF, #F8FAFC)' }}>
          <p style={{ fontWeight: 700, color: '#2563EB', fontSize: '13px' }}>{ad.title}</p>
          {ad.content && <p style={{ color: '#64748B', fontSize: '12px', marginTop: '4px' }}>{ad.content}</p>}
        </div>
      )}
      {ad.type === 'video' && ad.videoUrl && (
        <video src={ad.videoUrl} controls style={{ width: '100%', maxHeight: '200px' }} />
      )}
      {ad.type === 'pdf' && (
        <div style={{ padding: '14px 16px', textAlign: 'center' }}>
          <p style={{ fontWeight: 700, color: '#2563EB', fontSize: '13px', marginBottom: '8px' }}>{ad.title}</p>
          <a href={ad.pdfUrl} target="_blank" rel="noopener" className="btn btn-primary btn-sm">View PDF</a>
        </div>
      )}
      {ad.whatsappNumber && (
        <a href={`https://wa.me/${ad.whatsappNumber.replace(/\+/g,'')}`} target="_blank" rel="noopener"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#25D366', color: '#fff', padding: '10px 16px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
          Message Us on WhatsApp
        </a>
      )}
      <span style={{ position: 'absolute', top: '6px', right: '8px', fontSize: '9px', color: '#94A3B8', background: 'rgba(255,255,255,0.95)', padding: '2px 6px', borderRadius: '3px', fontWeight: 500 }}>Ad</span>
    </div>
  );
}

export default function HomePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [artRes, catRes] = await Promise.all([fetch(`${API_URL}/articles?limit=20`), fetch(`${API_URL}/categories`)]);
      const artData = await artRes.json();
      const catData = await catRes.json();
      const list = Array.isArray(artData) ? artData : artData?.articles || [];
      const published = list.filter((a: any) => a.status === 'published');
      published.sort((a: any, b: any) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
      setArticles(published);
      setCategories(Array.isArray(catData) ? catData : []);
    } catch {} finally { setLoading(false); }
  };

  const getBadge = (slug: string) => {
    const m: Record<string, string> = { 'ai-training': 'badge-blue', 'psychology-facts': 'badge-green', 'financial-literacy': 'badge-amber' };
    return m[slug] || 'badge-blue';
  };
  const getReadTime = (c: string) => c ? Math.max(1, Math.ceil(c.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)) + ' min read' : '1 min read';

  const featured = articles[0];
  const latest = articles.slice(1, 7);

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-particles">{[...Array(8)].map((_, i) => (<div key={i} className="hero-particle"></div>))}</div>
        <div className="hero-content">
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ flex: '1 1 400px', maxWidth: '550px' }}>
                <div className="animate-fade-up"><h1 className="hero-title"><span>Secrets That Elevate You</span></h1></div>
                <div className="animate-fade-up" style={{ animationDelay: '0.15s' }}><p className="hero-sub">Master Artificial Intelligence. Understand the human mind. Build lasting wealth. Expert-crafted content designed to help you think smarter, make better decisions, and grow continuously.</p></div>
                <div className="animate-fade-up" style={{ animationDelay: '0.3s', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <Link href="/articles" className="btn btn-primary btn-lg">Explore Articles</Link>
                  <Link href="/categories/ai-training" className="btn btn-outline btn-lg">Browse Categories</Link>
                </div>
              </div>
              <RotatingCard />
            </div>
          </div>
        </div>
        <div className="scroll-indicator"><span>Explore</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></div>
      </section>

      {/* ===== HOME BANNER AD ===== */}
      <div className="container" style={{ margin: '12px auto' }}>
        <AdBanner position="home_banner" />
      </div>

      {/* ===== FEATURED + SIDEBAR AD ===== */}
      {featured && (
        <section className="section-sm">
          <div className="container">
            <h2 className="text-xl font-extrabold mb-6">Featured Article</h2>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              <Link href={`/articles/${featured.slug}`} className="card animate-fade-up" style={{ flex: '1 1 60%', display: 'flex', gap: '20px', padding: '20px', flexWrap: 'wrap' }}>
                {featured.featuredImageUrl && (
                  <div style={{ width: '200px', height: '140px', flexShrink: 0, borderRadius: '10px', overflow: 'hidden' }}>
                    <img src={featured.featuredImageUrl} alt={featured.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <span className={`badge ${getBadge(featured.categoryId?.slug || '')}`}><span className="badge-dot"></span>{featured.categoryId?.name || 'General'}</span>
                  <h2 className="text-lg font-extrabold mt-2 mb-2 leading-snug">{featured.title}</h2>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-2">{featured.excerpt || 'Read more...'}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{getReadTime(featured.content)}</span><span>&middot;</span><span>{featured.viewCount || 0} views</span><span>&middot;</span><span>{featured.likeCount || 0} likes</span>
                  </div>
                </div>
              </Link>
              <div style={{ flex: '0 0 280px' }} className="hidden lg:block">
                <AdBanner position="sidebar" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== LATEST ARTICLES ===== */}
      <section className="section" style={{ background: '#F8FAFC' }}>
        <div className="container">
          <h2 className="section-title">Latest Articles</h2>
          <p className="section-sub">Fresh insights published weekly across all categories</p>
          {loading ? (
            <div className="empty-state"><div className="empty-state-icon">⌛</div><p className="empty-state-title">Loading articles...</p></div>
          ) : latest.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div>
              <p className="empty-state-title">No articles yet</p><p className="empty-state-desc">Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latest.slice(0, 2).map((a: any) => (
                <Link key={a._id} href={`/articles/${a.slug}`} className="article-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {a.featuredImageUrl && (
                    <div className="article-card-img" style={{ height: '200px', flexShrink: 0 }}>
                      <img src={a.featuredImageUrl} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div className="article-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '18px' }}>
                <span className={`badge ${getBadge(a.categoryId?.slug || '')}`} style={{ fontSize: '10px', padding: '3px 8px', width: 'fit-content' }}>
                  <span className="badge-dot"></span>{a.categoryId?.name || 'General'}
                </span>
                <h3 className="text-sm font-bold mt-2 mb-1 leading-snug line-clamp-2" style={{ flex: 1 }}>{a.title}</h3>
                <p style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '8px' }}>
                  {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently'}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-auto pt-2 border-t border-gray-100">
                  <span>{getReadTime(a.content)}</span><span>&middot;</span>
                  <span>{a.viewCount || 0} views</span><span>&middot;</span>
                  <span>{a.likeCount || 0} likes</span>
                </div>
              </div>
                </Link>
              ))}
                <div className="article-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                </div>
              {latest.slice(2).map((a: any) => (
                <Link key={a._id} href={`/articles/${a.slug}`} className="article-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {a.featuredImageUrl && (
                    <div className="article-card-img" style={{ height: '200px', flexShrink: 0 }}>
                      <img src={a.featuredImageUrl} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div className="article-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '18px' }}>
                    <span className={`badge ${getBadge(a.categoryId?.slug || '')}`} style={{ fontSize: '10px', padding: '3px 8px', width: 'fit-content' }}>
                      <span className="badge-dot"></span>{a.categoryId?.name || 'General'}
                    </span>
                    <h3 className="text-sm font-bold mt-2 mb-2 leading-snug line-clamp-2" style={{ flex: 1 }}>{a.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-auto pt-2 border-t border-gray-100">
                      <span>{getReadTime(a.content)}</span><span>&middot;</span>
                      <span>{a.viewCount || 0} views</span><span>&middot;</span>
                      <span>{a.likeCount || 0} likes</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-10"><Link href="/articles" className="btn btn-primary btn-lg">View All Articles</Link></div>
        </div>
      </section>

      {/* ===== CATEGORIES + AD ===== */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '48px' }}>
            <div>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '4px' }}>Explore Categories</h2>
              <p className="section-sub" style={{ textAlign: 'left', margin: 0 }}>Dive deep into knowledge that transforms careers, minds, and bank accounts</p>
            </div>
            <div style={{ width: '250px' }}>
              <AdsTicker />
          </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
            {categories.map((cat: any) => (
              <Link key={cat._id} href={`/categories/${cat.slug}`} className="card text-center" style={{ padding: '36px 24px' }}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${cat.slug === 'ai-training' ? 'bg-blue-50 text-blue-600' : cat.slug === 'psychology-facts' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {cat.slug === 'ai-training' && <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707"/>}
                    {cat.slug === 'psychology-facts' && <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13"/>}
                    {cat.slug === 'financial-literacy' && <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2"/>}
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">{cat.name}</h3>
                <p className="text-gray-500 text-sm">{cat.description || 'Browse articles in this category'}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="text-3xl font-extrabold mb-4">Ready to Elevate Your Knowledge?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">Join thousands of readers discovering new knowledge every day on AHA NIHO.</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <ClientCTA />
            <Link href="/articles" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>Browse Articles</Link>
          </div>
        </div>
      </section>
    </>
  );
}