'use client';
import './globals.css';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const mainLinks = [
  { href: '/', label: 'Home' },
  { href: '/articles', label: 'Articles' },
  { href: '/categories/ai-trends', label: 'AI Trends' },
  { href: '/categories/real-and-fact', label: 'Real and Fact' },
  { href: '/categories/finewave', label: 'Finewave' },
  { href: '/categories/bonus', label: 'Bonus' },
];
const moreLinks = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/bookmarks', label: 'My Bookmarks' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
];

function NotificationBell() {
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<any[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  useEffect(() => { fetchNotifs(); const i = setInterval(fetchNotifs, 30000); return () => clearInterval(i); }, []);
  const fetchNotifs = () => {
    const t = localStorage.getItem('token'); if (!t) return;
    fetch(`${API_URL}/notifications/unread-count`,{headers:{Authorization:`Bearer ${t}`}}).then(r=>r.json()).then(d=>setUnread(d.count||0));
    fetch(`${API_URL}/notifications`,{headers:{Authorization:`Bearer ${t}`}}).then(r=>r.json()).then(d=>setNotifs(Array.isArray(d)?d.slice(0,5):[]));
  };
  return (
    <div className="relative">
      <button onClick={()=>setOpen(!open)} className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors relative">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        {unread>0&&<span style={{position:'absolute',top:'6px',right:'6px',width:'8px',height:'8px',background:'#EF4444',borderRadius:'50%'}}></span>}
      </button>
      {open&&(<><div className="fixed inset-0 z-40" onClick={()=>setOpen(false)}/><div className="dropdown" style={{right:0,minWidth:'300px'}}>
        <div style={{display:'flex',justifyContent:'space-between',padding:'12px 16px',borderBottom:'1px solid #E2E8F0'}}><p className="font-semibold text-sm">Notifications</p>{unread>0&&<button className="text-xs text-blue-600 font-semibold" onClick={()=>{fetch(`${API_URL}/notifications/mark-all-read`,{method:'PUT',headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}});setUnread(0);}}>Mark all read</button>}</div>
        {notifs.length===0?<p className="text-sm text-gray-400 text-center py-8">No notifications</p>:notifs.map((n:any)=>(<div key={n._id} style={{padding:'10px 16px',borderBottom:'1px solid #F1F5F9',opacity:n.isRead?0.6:1}}><p className="text-sm font-semibold">{n.title}</p><p className="text-xs text-gray-500">{n.message}</p></div>))}
      </div></>)}
    </div>
  );
}

function MobileBottomBar() {
  return (
    <div className="mobile-bottom-bar">
      <a href="/" className="bottom-bar-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>Home</a>
      <button onClick={()=>{
        const cats=[{name:'AI Trends',slug:'ai-trends',color:'#2563EB',icon:'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707'},{name:'Real and Fact',slug:'real-and-fact',color:'#10B981',icon:'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13'},{name:'Finewave',slug:'finewave',color:'#F59E0B',icon:'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2'},{name:'Bonus',slug:'bonus',color:'#EC4899',icon:'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'}];
        const o=document.createElement('div');o.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.3);z-index:60;';o.id='co';
        const d=document.createElement('div');d.style.cssText='position:fixed;bottom:60px;left:16px;right:16px;background:#fff;border-radius:20px;padding:20px;z-index:61;animation:slideUp 0.3s ease;box-shadow:0 -4px 30px rgba(0,0,0,0.1);';
        d.innerHTML='<p style="font-size:14px;font-weight:700;color:#0F172A;margin-bottom:16px;text-align:center">Categories</p>'+cats.map(c=>`<a href="/categories/${c.slug}" style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:12px;text-decoration:none;color:#334155;font-size:14px;font-weight:600;margin-bottom:4px"><span style="width:36px;height:36px;border-radius:10px;background:${c.color}15;display:flex;align-items:center;justify-content:center;color:${c.color}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="${c.icon}"/></svg></span>${c.name}</a>`).join('');
        document.body.appendChild(o);document.body.appendChild(d);o.onclick=()=>{o.remove();d.remove();};
      }} className="bottom-bar-item" style={{background:'none',border:'none',cursor:'pointer',fontFamily:'inherit',fontSize:'10px'}}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>Categories</button>
      <button onClick={()=>{
        const links=[{label:'Home',href:'/'},{label:'Articles',href:'/articles'},{label:'About',href:'/about'},{label:'Contact',href:'/contact'},{label:'Privacy',href:'/privacy'},{label:'Terms',href:'/terms'}];
        const o=document.createElement('div');o.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.3);z-index:60;';o.id='bo';
        const d=document.createElement('div');d.style.cssText='position:fixed;bottom:60px;left:16px;right:16px;max-height:70vh;overflow-y:auto;background:#fff;border-radius:20px;padding:20px;z-index:61;animation:slideUp 0.3s ease;box-shadow:0 -4px 30px rgba(0,0,0,0.1);';
        d.innerHTML='<p style="font-size:14px;font-weight:700;color:#0F172A;margin-bottom:16px;text-align:center">Browse</p>'+links.map(l=>`<a href="${l.href}" style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:12px;text-decoration:none;color:#334155;font-size:14px;font-weight:600;border-bottom:1px solid #F1F5F9">${l.label}</a>`).join('');
        document.body.appendChild(o);document.body.appendChild(d);o.onclick=()=>{o.remove();d.remove();};
      }} className="bottom-bar-item" style={{background:'none',border:'none',cursor:'pointer',fontFamily:'inherit',fontSize:'10px'}}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>Browse</button>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); const router = useRouter();
  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/settings');
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false); const [drawerOpen, setDrawerOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false); const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false); const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [maintenance, setMaintenance] = useState(false); const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hs = () => setScrolled(window.scrollY > 60);
      window.addEventListener('scroll', hs); checkAuth(); checkMaintenance();
      window.addEventListener('storage', checkAuth);
      return () => { window.removeEventListener('scroll', hs); window.removeEventListener('storage', checkAuth); };
    }
  }, []);

  const checkAuth = () => {
    const t = localStorage.getItem('token'); const u = localStorage.getItem('user');
    if (t) { setIsLoggedIn(true); try { const p = JSON.parse(atob(t.split('.')[1])); setUserRole(p.role||''); } catch {} if (u) setUserName(JSON.parse(u).firstName||'User'); }
    else { setIsLoggedIn(false); setUserName(''); setUserRole(''); }
  };
  const checkMaintenance = async () => {
    try { const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL||'http://localhost:5000/api/v1'}/settings`); const d = await r.json(); const s = Array.isArray(d)?d:[]; const m = s.find((x:any)=>x.key==='maintenance_mode'); if(m) setMaintenance(m.value===true||m.value==='true'); } catch {}
  };
  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); document.cookie='token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'; setIsLoggedIn(false); setProfileOpen(false); router.push('/'); };
  const getDashboard = () => { if(userRole==='administrator') return '/dashboard/admin'; if(userRole==='publisher') return '/dashboard/publisher'; if(userRole==='service_staff') return '/dashboard/staff'; return '/'; };
  const closeAll = () => { setDrawerOpen(false); setSheetOpen(false); };

  if (isDashboard) return <html lang="en"><body className="min-h-screen bg-gray-100">{children}</body></html>;

  const headerClass = isHome && !scrolled ? 'header header-transparent' : scrolled ? 'header header-scrolled' : 'header header-default';

  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <div className="min-h-screen flex flex-col">
          <header className={headerClass}>
            <div className="container header-inner">
              <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center no-underline"><img src="/logo.png" alt="Aha Secret Max" style={{height:'88px',width:'auto'}}/></Link>
                <button onClick={()=>setDrawerOpen(true)} className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all text-gray-600 font-medium text-sm border border-gray-200">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>Explore</button>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={()=>setSearchOpen(true)} className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg></button>
                {isLoggedIn && <NotificationBell />}
                {isLoggedIn ? (
                  <div className="relative">
                    <button onClick={()=>setProfileOpen(!profileOpen)} className="p-1 rounded-full hover:bg-gray-100 transition-colors"><div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">{userName?.[0]?.toUpperCase()||'A'}</div></button>
                  {profileOpen && (<><div className="fixed inset-0 z-40" onClick={()=>setProfileOpen(false)}/><div className="dropdown"><div className="px-4 py-3 border-b"><p className="font-semibold text-sm">{userName}</p><p className="text-xs text-gray-500 capitalize">{userRole?.replace('_',' ')||'User'}</p></div>{userRole!=='public_user'&&<Link href={getDashboard()} className="dropdown-item" onClick={()=>setProfileOpen(false)}>Dashboard</Link>}<Link href="/bookmarks" className="dropdown-item" onClick={()=>setProfileOpen(false)}>My Bookmarks</Link>{userRole!=='public_user'&&<Link href="/settings" className="dropdown-item" onClick={()=>setProfileOpen(false)}>Settings</Link>}<div className="dropdown-divider"></div><button onClick={handleLogout} className="dropdown-item text-red-500">Sign Out</button></div></>)}
                  </div>
                ) : <Link href="/login" className="btn btn-primary btn-sm">Sign In</Link>}
              </div>
            </div>
          </header>

          {drawerOpen && (<><div className="drawer-overlay hidden lg:block" onClick={()=>setDrawerOpen(false)}/><aside className="drawer hidden lg:flex flex-col">
            <div className="drawer-header"><div className="flex items-center justify-between"><Link href="/" className="flex items-center no-underline" onClick={closeAll}><img src="/logo.png" alt="Aha Secret Max" style={{height:'88px',width:'auto'}}/></Link><button onClick={()=>setDrawerOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg></button></div><p className="text-xs text-gray-500 mt-2">Secrets That Elevate You</p></div>
            <div className="drawer-body">
              <div className="drawer-section"><div className="drawer-section-title">Discover</div>{mainLinks.map(l=><Link key={l.href} href={l.href} onClick={closeAll} className={`drawer-link ${pathname===l.href?'active':''}`}>{l.label}</Link>)}</div>
              <div className="drawer-divider"></div>
              <div className="drawer-section"><div className="drawer-section-title">Platform</div>{moreLinks.map(l=><Link key={l.href} href={l.href} onClick={closeAll} className={`drawer-link ${pathname===l.href?'active':''}`}>{l.label}</Link>)}</div>
              <div className="drawer-divider"></div>
              <div className="drawer-section">{isLoggedIn?(<>{userRole!=='public_user'&&<Link href={getDashboard()} onClick={closeAll} className="drawer-link">Dashboard</Link>}{userRole!=='public_user'&&<Link href="/settings" onClick={closeAll} className="drawer-link">Settings</Link>}<button onClick={()=>{handleLogout();closeAll();}} className="drawer-link text-red-500 w-full text-left">Sign Out</button></>):<Link href="/login" onClick={closeAll} className="btn btn-primary w-full text-center mt-2">Sign In</Link>}</div>
            </div>
          </aside></>)}

          {sheetOpen && (<><div className="sheet-overlay lg:hidden" onClick={()=>setSheetOpen(false)}/><div className="sheet lg:hidden"><div className="sheet-handle"></div><nav className="px-4 space-y-1">{[...mainLinks,...moreLinks].map(l=><Link key={l.href} href={l.href} onClick={closeAll} className={`drawer-link ${pathname===l.href?'active':''}`}>{l.label}</Link>)}<div className="drawer-divider"></div>{isLoggedIn?(<>{userRole!=='public_user'&&<Link href={getDashboard()} onClick={closeAll} className="drawer-link">Dashboard</Link>}{userRole!=='public_user'&&<Link href="/settings" onClick={closeAll} className="drawer-link">Settings</Link>}<button onClick={()=>{handleLogout();closeAll();}} className="drawer-link text-red-500 w-full text-left">Sign Out</button></>):<Link href="/login" onClick={closeAll} className="btn btn-primary w-full text-center mt-2">Sign In</Link>}</nav></div></>)}

          {searchOpen && (<div className="search-overlay" onClick={(e)=>{if(e.target===e.currentTarget) setSearchOpen(false);}}><button onClick={()=>setSearchOpen(false)} className="absolute top-6 right-6 p-2 rounded-lg hover:bg-gray-100 text-gray-500"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg></button><input autoFocus type="text" placeholder="Search articles..." className="search-overlay-input" onKeyDown={e=>{if(e.key==='Enter'&&(e.target as HTMLInputElement).value.trim()){setSearchOpen(false);router.push(`/search?q=${encodeURIComponent((e.target as HTMLInputElement).value)}`);}}}/></div>)}

          <main className="flex-1">{maintenance&&userRole!=='administrator'?(<div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh',padding:'48px 24px',textAlign:'center'}}><div><div style={{fontSize:'48px',marginBottom:'16px'}}>🔧</div><h1 style={{fontSize:'28px',fontWeight:800,color:'#0F172A',marginBottom:'8px'}}>Under Maintenance</h1><p style={{color:'#64748B',fontSize:'15px',maxWidth:'400px'}}>We're currently performing scheduled maintenance. Please check back soon.</p></div></div>):children}</main>

          <footer className="footer"><div className="container"><div className="footer-grid">
            <div><Link href="/" className="flex items-center no-underline mb-4"><img src="/logo.png" alt="Aha Secret Max" style={{height:'100px',width:'auto',filter:'brightness(0) invert(1)'}}/></Link><p className="text-gray-400 text-sm max-w-xs">Discover secrets about AI Trends, Real Psychology, Financial Freedom, and Exclusive Bonus content.</p></div>
            <div><h4 className="footer-title">Categories</h4><a href="/categories/ai-trends" className="footer-link">AI Trends</a><a href="/categories/real-and-fact" className="footer-link">Real and Fact</a><a href="/categories/finewave" className="footer-link">Finewave</a><a href="/categories/bonus" className="footer-link">Bonus</a></div>
            <div><h4 className="footer-title">Links</h4><a href="/" className="footer-link">Home</a><a href="/articles" className="footer-link">Articles</a><a href="/about" className="footer-link">About</a><a href="/contact" className="footer-link">Contact</a></div>
            <div><h4 className="footer-title">Connect</h4><div style={{display:'flex',gap:'12px',flexWrap:'wrap',marginBottom:'16px'}}>
              <a href="https://x.com/ahaniho01" target="_blank" rel="noopener" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all" title="X"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
              <a href="https://instagram.com/ahaniho01" target="_blank" rel="noopener" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all" title="Instagram"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg></a>
              <a href="https://linkedin.com/company/ahaniho" target="_blank" rel="noopener" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all" title="LinkedIn"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
              <a href="https://tiktok.com/@ahaniho01" target="_blank" rel="noopener" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all" title="TikTok"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg></a>
              <a href="https://youtube.com/@ahaniho01" target="_blank" rel="noopener" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all" title="YouTube"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
            </div><a href="/privacy" className="footer-link">Privacy Policy</a><a href="/terms" className="footer-link">Terms of Service</a></div>
          </div><div className="footer-marquee"><div className="footer-marquee-inner">{['AI Trends','Real and Fact','Finewave','Bonus','Machine Learning','Wealth Building'].map((w,i)=>(<span key={i}>{w}</span>))}</div></div><div className="footer-bottom"><div className="footer-bottom-inner">&copy; {new Date().getFullYear()} Aha Secret Max &mdash; Powered by <a href="https://niroflixx.online" target="_blank" rel="noopener">Niroflixx</a></div></div></div></footer>
          <MobileBottomBar />
        </div>
      </body>
    </html>
  );
}