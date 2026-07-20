'use client';
import './globals.css';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const mainLinks = [
  { href: '/', label: 'Home' },
  { href: '/articles', label: 'Articles' },
  { href: '/categories/ai-training', label: 'AI Training' },
  { href: '/categories/psychology-facts', label: 'Psychology' },
  { href: '/categories/financial-literacy', label: 'Finance' },
];
const moreLinks = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
];

function NotificationBell() {
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<any[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  useEffect(() => {
  fetchNotifs();
  const interval = setInterval(fetchNotifs, 30000);
  return () => clearInterval(interval);
}, []);

const fetchNotifs = () => {
  const token = localStorage.getItem('token');
  if (!token) return;
  fetch(`${API_URL}/notifications/unread-count`, { headers: { Authorization: `Bearer ${token}` } })
    .then(r => r.json()).then(d => setUnread(d.count || 0));
  fetch(`${API_URL}/notifications`, { headers: { Authorization: `Bearer ${token}` } })
    .then(r => r.json()).then(d => setNotifs(Array.isArray(d) ? d.slice(0, 5) : []));
};

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors relative">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        {unread > 0 && <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%' }}></span>}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="dropdown" style={{ right: 0, minWidth: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>
              <p className="font-semibold text-sm">Notifications</p>
              {unread > 0 && <button className="text-xs text-blue-600 font-semibold" onClick={() => { fetch(`${API_URL}/notifications/mark-all-read`, { method: 'PUT', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }); setUnread(0); }}>Mark all read</button>}
            </div>
            {notifs.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No notifications</p>
            ) : (
              notifs.map((n: any) => (
                <div key={n._id} style={{ padding: '10px 16px', borderBottom: '1px solid #F1F5F9', opacity: n.isRead ? 0.6 : 1 }}>
                  <p className="text-sm font-semibold">{n.title}</p>
                  <p className="text-xs text-gray-500">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/settings');
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => setScrolled(window.scrollY > 60);
      window.addEventListener('scroll', handleScroll);
      checkAuth();
      checkMaintenance();
      window.addEventListener('storage', checkAuth);
      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('storage', checkAuth);
      };
    }
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token) {
      setIsLoggedIn(true);
      try { const p = JSON.parse(atob(token.split('.')[1])); setUserRole(p.role || ''); } catch {}
      if (user) setUserName(JSON.parse(user).firstName || 'User');
    } else {
      setIsLoggedIn(false); setUserName(''); setUserRole('');
    }
  };
  const checkMaintenance = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/settings`);
    const data = await res.json();
    const settings = Array.isArray(data) ? data : [];
    const mm = settings.find((s: any) => s.key === 'maintenance_mode');
    if (mm) setMaintenance(mm.value === true || mm.value === 'true');
  } catch {}
};

  const handleLogout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('user');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setIsLoggedIn(false); setProfileOpen(false); router.push('/');
  };

  const getDashboard = () => {
    if (userRole === 'administrator') return '/dashboard/admin';
    if (userRole === 'publisher') return '/dashboard/publisher';
    if (userRole === 'service_staff') return '/dashboard/staff';
    return '/';
  };

  const closeAll = () => { setDrawerOpen(false); setSheetOpen(false); };

  if (isDashboard) {
    return <html lang="en"><body className="min-h-screen bg-gray-100">{children}</body></html>;
  }

  const headerClass = isHome && !scrolled ? 'header header-transparent' : scrolled ? 'header header-scrolled' : 'header header-default';

  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <div className="min-h-screen flex flex-col">

          <header className={headerClass}>
            <div className="container header-inner">
              <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center no-underline">
                  <img src="/logo.png" alt="Aha Secret Max" style={{ height: '88px', width: 'auto' }} />
                </Link>
                <button onClick={() => setDrawerOpen(true)} className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all text-gray-600 font-medium text-sm border border-gray-200">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                  Explore
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => setSheetOpen(true)} className="lg:hidden p-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                </button>
                <button onClick={() => setSearchOpen(true)} className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                </button>
                <select
  onChange={(e) => {
    const lang = e.target.value;
    if (lang && lang !== 'en') {
      window.location.href = `https://translate.google.com/translate?hl=${lang}&sl=en&tl=${lang}&u=${encodeURIComponent(window.location.href)}`;
    }
  }}
  style={{
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    fontSize: '13px',
    fontWeight: 600,
    color: '#64748B',
    background: '#fff',
    cursor: 'pointer',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
  }}
>
  <option value="en">EN</option>
  <option value="rw">RW</option>
  <option value="fr">FR</option>
</select>
                {isLoggedIn && <NotificationBell />}
                {isLoggedIn ? (
                  <div className="relative">
                    <button onClick={() => setProfileOpen(!profileOpen)} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">{userName?.[0]?.toUpperCase() || 'A'}</div>
                    </button>
                    {profileOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                        <div className="dropdown">
                          <div className="px-4 py-3 border-b"><p className="font-semibold text-sm">{userName}</p><p className="text-xs text-gray-500 capitalize">{userRole?.replace('_',' ') || 'User'}</p></div>
                          {userRole !== 'public_user' && <Link href={getDashboard()} className="dropdown-item" onClick={() => setProfileOpen(false)}>Dashboard</Link>}
                          {userRole !== 'public_user' && <Link href="/settings" className="dropdown-item" onClick={() => setProfileOpen(false)}>Settings</Link>}
                          <div className="dropdown-divider"></div>
                          <button onClick={handleLogout} className="dropdown-item text-red-500">Sign Out</button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <Link href="/login" className="btn btn-primary btn-sm">Sign In</Link>
                )}
              </div>
            </div>
          </header>

          {drawerOpen && (
            <>
              <div className="drawer-overlay hidden lg:block" onClick={() => setDrawerOpen(false)} />
              <aside className="drawer hidden lg:flex flex-col">
                <div className="drawer-header">
                  <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center no-underline" onClick={closeAll}><img src="/logo.png" alt="Aha Secret Max" style={{ height: '88px', width: 'auto' }} /></Link>
                    <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg></button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Secrets That Elevate You</p>
                </div>
                <div className="drawer-body">
                  <div className="drawer-section"><div className="drawer-section-title">Discover</div>
                    {mainLinks.map(l => <Link key={l.href} href={l.href} onClick={closeAll} className={`drawer-link ${pathname===l.href?'active':''}`}>{l.label}</Link>)}
                  </div>
                  <div className="drawer-divider"></div>
                  <div className="drawer-section"><div className="drawer-section-title">Platform</div>
                    {moreLinks.map(l => <Link key={l.href} href={l.href} onClick={closeAll} className={`drawer-link ${pathname===l.href?'active':''}`}>{l.label}</Link>)}
                  </div>
                  <div className="drawer-divider"></div>
                  <div className="drawer-section">
                    {isLoggedIn ? (
                      <>
                        {userRole !== 'public_user' && <Link href={getDashboard()} onClick={closeAll} className="drawer-link">Dashboard</Link>}
                        {userRole !== 'public_user' && <Link href="/settings" onClick={closeAll} className="drawer-link">Settings</Link>}
                        <button onClick={()=>{handleLogout();closeAll();}} className="drawer-link text-red-500 w-full text-left">Sign Out</button>
                      </>
                    ) : <Link href="/login" onClick={closeAll} className="btn btn-primary w-full text-center mt-2">Sign In</Link>}
                  </div>
                </div>
              </aside>
            </>
          )}

          {sheetOpen && (
            <>
              <div className="sheet-overlay lg:hidden" onClick={() => setSheetOpen(false)} />
              <div className="sheet lg:hidden">
                <div className="sheet-handle"></div>
                <nav className="px-4 space-y-1">
                  {[...mainLinks,...moreLinks].map(l => <Link key={l.href} href={l.href} onClick={closeAll} className={`drawer-link ${pathname===l.href?'active':''}`}>{l.label}</Link>)}
                  <div className="drawer-divider"></div>
                  {isLoggedIn ? (
                    <>
                      {userRole !== 'public_user' && <Link href={getDashboard()} onClick={closeAll} className="drawer-link">Dashboard</Link>}
                      {userRole !== 'public_user' && <Link href="/settings" onClick={closeAll} className="drawer-link">Settings</Link>}
                      <button onClick={()=>{handleLogout();closeAll();}} className="drawer-link text-red-500 w-full text-left">Sign Out</button>
                    </>
                  ) : <Link href="/login" onClick={closeAll} className="btn btn-primary w-full text-center mt-2">Sign In</Link>}
                </nav>
              </div>
            </>
          )}

          {searchOpen && (
            <div className="search-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}>
              <button onClick={() => setSearchOpen(false)} className="absolute top-6 right-6 p-2 rounded-lg hover:bg-gray-100 text-gray-500"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg></button>
              <input autoFocus type="text" placeholder="Search AI, Psychology or Finance..." className="search-overlay-input" onKeyDown={e => { if (e.key==='Enter' && (e.target as HTMLInputElement).value.trim()) { setSearchOpen(false); router.push(`/search?q=${encodeURIComponent((e.target as HTMLInputElement).value)}`); }}} />
              <div className="mt-8 max-w-[640px] w-full"><p className="text-xs text-gray-400 uppercase tracking-wider mb-4">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {['Machine Learning','Cognitive Biases','Wealth Building','Prompt Engineering','Emotional Intelligence','Investing'].map(t => (
                    <button key={t} onClick={() => { setSearchOpen(false); router.push(`/search?q=${encodeURIComponent(t)}`); }} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors">{t}</button>
                  ))}
                </div>
              </div>
            </div>
          )}


          <main className="flex-1">
          {maintenance && userRole !== 'administrator' ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '48px 24px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔧</div>
                <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Under Maintenance</h1>
                <p style={{ color: '#64748B', fontSize: '15px', maxWidth: '400px' }}>We're currently performing scheduled maintenance. Please check back soon.</p>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
          <footer className="footer">
            <div className="container">
              <div className="footer-grid">
                <div>
                  <Link href="/" className="flex items-center no-underline mb-4"><img src="/logo.png" alt="Aha Secret Max" style={{ height: '100px', width: 'auto', filter: 'brightness(0) invert(1)' }} /></Link>
                  <p className="text-gray-400 text-sm max-w-xs">Professional content publishing platform for AI, Psychology, and Finance.</p>
                </div>
                <div><h4 className="footer-title">Categories</h4><a href="/categories/ai-training" className="footer-link">AI Training</a><a href="/categories/psychology-facts" className="footer-link">Psychology Facts</a><a href="/categories/financial-literacy" className="footer-link">Financial Literacy</a></div>
                <div><h4 className="footer-title">Links</h4><a href="/" className="footer-link">Home</a><a href="/articles" className="footer-link">Articles</a><a href="/about" className="footer-link">About</a><a href="/contact" className="footer-link">Contact</a></div>
                <div><h4 className="footer-title">Connect</h4>
                  <div className="flex gap-3 mb-4">
                    {[{n:'X',d:'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'},{n:'IG',d:'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'},{n:'LN',d:'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'},{n:'TK',d:'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z'},{n:'YT',d:'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'}].map(s => (
                      <a key={s.n} href={`https://${s.n==='X'?'x':s.n==='IG'?'instagram':s.n==='LN'?'linkedin':s.n==='TK'?'tiktok':'youtube'}.com`} target="_blank" rel="noopener" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all" title={s.n==='X'?'X (Twitter)':s.n==='IG'?'Instagram':s.n==='LN'?'LinkedIn':s.n==='TK'?'TikTok':'YouTube'}><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d={s.d}/></svg></a>
                    ))}
                  </div>
                  <a href="/privacy" className="footer-link">Privacy Policy</a><a href="/terms" className="footer-link">Terms of Service</a>
                </div>
              </div>
              <div className="footer-marquee"><div className="footer-marquee-inner">{['Artificial Intelligence','Psychology Facts','Financial Literacy','Machine Learning','Cognitive Science','Wealth Building','Prompt Engineering','Emotional Intelligence','Investing','Deep Learning','Behavioral Psychology','Personal Finance','Neural Networks','Mental Wellness','Budgeting','AI Ethics','Human Behavior','Stock Market','Data Science','Mindfulness','Crypto','Robotics','Happiness','Real Estate','Automation'].map((w,i)=>(<span key={i}>{w}</span>))}</div></div>
              <div className="footer-bottom"><div className="footer-bottom-inner">&copy; {new Date().getFullYear()} Aha Secret Max &mdash; Powered by <a href="https://niroflixx.online" target="_blank" rel="noopener">Niroflixx</a></div></div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}