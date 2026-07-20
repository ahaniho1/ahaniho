'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const CLOUDINARY_CLOUD = 'dlxiuwv30';
const CLOUDINARY_PRESET = 'wbico_products';

export default function DashboardArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', categoryId: '', tags: '',
    featuredImageUrl: '', videoUrl: '', videoType: '', thumbnailUrl: '', status: 'published',
    seriesId: '', seriesOrder: '',
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUserRole(JSON.parse(u).role || '');
    fetchArticles(); fetchCategories();
  }, []);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const fetchArticles = async () => {
    try {
      const res = await fetch(`${API_URL}/articles?limit=100`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setArticles(Array.isArray(data) ? data : data?.articles || data?.data || []);
    } catch {} finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch {}
  };

const handleEdit = async (article: any) => {
  setEditingId(article._id);
  // Fetch full article to get content
  try {
    const res = await fetch(`${API_URL}/articles/${article.slug}`, { headers: { Authorization: `Bearer ${token}` } });
    const full = await res.json();
    setForm({
      title: full.title || '', slug: full.slug || '', excerpt: full.excerpt || '',
      content: full.content || '', categoryId: full.categoryId?._id || full.categoryId || '',
      tags: full.tags?.join(', ') || '', featuredImageUrl: full.featuredImageUrl || '',
      videoUrl: full.videoUrl || '', videoType: full.videoType || '',
      seriesId: full.seriesId || '', seriesOrder: full.seriesOrder || '',
      thumbnailUrl: full.thumbnailUrl || '',
      status: full.status || 'published',
    });
  } catch {
    // Fallback to article prop
    setForm({
      title: article.title || '', slug: article.slug || '', excerpt: article.excerpt || '',
      content: article.content || '', categoryId: article.categoryId?._id || article.categoryId || '',
      tags: article.tags?.join(', ') || '', featuredImageUrl: article.featuredImageUrl || '',
      videoUrl: article.videoUrl || '', videoType: article.videoType || '',
      thumbnailUrl: article.thumbnailUrl || '', seriesId: article.seriesId || '',
      seriesOrder: article.seriesOrder || '', status: article.status || 'published',
    });
  }
  setShowForm(true);
};

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    await fetch(`${API_URL}/articles/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchArticles();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'featuredImageUrl') => {
    const file = e.target.files?.[0]; if (!file) return;
    setImageUploading(true);
    const fd = new FormData(); fd.append('file', file); fd.append('upload_preset', CLOUDINARY_PRESET); fd.append('cloud_name', CLOUDINARY_CLOUD);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.secure_url) setForm({ ...form, [field]: data.secure_url });
    } catch { setError('Upload failed'); }
    setImageUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const payload = {
      title: form.title, slug: form.slug, excerpt: form.excerpt, content: form.content,
      categoryId: form.categoryId || null, authorId: user._id || null,
      tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      featuredImageUrl: form.featuredImageUrl, videoUrl: form.videoUrl,
      videoType: form.videoType,status: form.status,
      seriesId: form.seriesId, seriesOrder: form.seriesOrder ? Number(form.seriesOrder) : 0,
    };
    try {
      const url = editingId ? `${API_URL}/articles/${editingId}` : `${API_URL}/articles`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Failed');
      setShowForm(false); setEditingId(null);
      setForm({ title: '', slug: '', excerpt: '', content: '', categoryId: '', tags: '', featuredImageUrl: '', videoUrl: '', videoType: '', thumbnailUrl: '', seriesId: '', seriesOrder: '', status: 'published' });
      fetchArticles();
    } catch { setError('Error saving article'); }
    setSubmitting(false);
  };

  const handleApprove = async (id: string) => {
    await fetch(`${API_URL}/articles/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status: 'published', publishedAt: new Date() }) });
    fetchArticles();
  };

  const handleReject = async (id: string) => {
    await fetch(`${API_URL}/articles/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status: 'rejected' }) });
    fetchArticles();
  };

  const generateSlug = (title: string) => setForm({ ...form, title, slug: title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') });

  const statusStyle: Record<string, string> = { published: 'badge-green', pending: 'badge-amber', draft: 'badge-gray', rejected: 'badge-red' };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>;

  return (
    <div className="p-6 lg:p-8">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div><h1 className="text-2xl font-bold text-gray-900">Articles</h1><p className="text-gray-500 text-sm">Manage all platform articles</p></div>
        <button onClick={() => { setEditingId(null); setForm({ title: '', slug: '', excerpt: '', content: '', categoryId: '', tags: '', featuredImageUrl: '', videoUrl: '', videoType: '', thumbnailUrl: '', seriesId: '', seriesOrder: '', status: 'published' }); setShowForm(true); }} className="btn btn-primary">+ New Article</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '32px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead><tr style={{ borderBottom: '2px solid #E2E8F0', background: '#F8FAFC' }}>
            <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Title</th>
            <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Category</th>
            <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Status</th>
            <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Views</th>
            <th style={{ textAlign: 'right', padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Actions</th>
          </tr></thead>
          <tbody>
            {articles.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '64px 24px', color: '#94A3B8' }}>
                <p style={{ fontWeight: 600, color: '#64748B' }}>No articles yet</p>
              </td></tr>
            ) : articles.map((a: any) => (
              <tr key={a._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '14px 20px', fontWeight: 600 }}>{a.title}</td>
                <td style={{ padding: '14px 16px', color: '#64748B', fontSize: '13px' }}>{a.categoryId?.name || '—'}</td>
                <td style={{ padding: '14px 16px' }}><span className={`badge ${statusStyle[a.status] || 'badge-gray'}`} style={{ fontSize: '11px' }}><span className="badge-dot"></span>{a.status}</span></td>
                <td style={{ padding: '14px 16px', fontSize: '13px' }}>{a.viewCount || 0}</td>
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleEdit(a)} className="btn btn-ghost btn-sm" style={{ color: '#2563EB' }}>Edit</button>
                    {userRole === 'administrator' && a.status === 'pending' && (
                      <><button onClick={() => handleApprove(a._id)} className="btn btn-sm" style={{ background: '#10B981', color: '#fff' }}>Approve</button>
                      <button onClick={() => handleReject(a._id)} className="btn btn-sm" style={{ background: '#F59E0B', color: '#fff' }}>Reject</button></>
                    )}
                    {userRole === 'administrator' && <button onClick={() => handleDelete(a._id)} className="btn btn-ghost btn-sm" style={{ color: '#EF4444' }}>Delete</button>}
                    {userRole === 'publisher' && a.status !== 'published' && (
                      <button onClick={() => { const r = prompt('Reason:'); if (r) alert('Request sent: ' + r); }} className="btn btn-ghost btn-sm" style={{ color: '#EF4444' }}>Request Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="modal-box" style={{ maxWidth: '900px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px' }}>
              <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Article' : 'New Article'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            {error && <div style={{ background: '#FEF2F2', color: '#EF4444', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Title *</label><input type="text" required value={form.title} onChange={e => generateSlug(e.target.value)} className="input" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Slug *</label><input type="text" required value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="input" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="select">
                  {userRole === 'administrator' ? <option value="published">Publish Immediately</option> : <><option value="draft">Draft</option><option value="pending">Submit for Review</option></>}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Series ID (optional)</label><input type="text" value={form.seriesId} onChange={e => setForm({...form, seriesId: e.target.value})} className="input" placeholder="e.g. ai-basics" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Series Order</label><input type="number" value={form.seriesOrder} onChange={e => setForm({...form, seriesOrder: e.target.value})} className="input" placeholder="1" /></div>
            </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label><select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} className="select"><option value="">Select</option>{categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Tags</label><input type="text" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className="input" placeholder="ai, ml" /></div>
              </div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Excerpt</label><textarea rows={2} value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} className="textarea" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Featured Image</label><input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'featuredImageUrl')} className="input" />{imageUploading && <span className="text-xs text-blue-600">Uploading...</span>}{form.featuredImageUrl && <img src={form.featuredImageUrl} style={{ marginTop: '8px', height: '80px', borderRadius: '8px' }} />}<input type="text" value={form.featuredImageUrl} onChange={e => setForm({...form, featuredImageUrl: e.target.value})} className="input mt-2" placeholder="Or paste URL" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Video Type</label><select value={form.videoType} onChange={e => setForm({...form, videoType: e.target.value})} className="select"><option value="">None</option><option value="youtube">YouTube</option><option value="upload">Upload</option></select></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Video URL</label><input type="text" value={form.videoUrl} onChange={e => setForm({...form, videoUrl: e.target.value})} className="input" placeholder="https://..." /></div>
              </div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Content</label>
                <ReactQuill theme="snow" value={form.content} onChange={val => setForm({...form, content: val})}
                  modules={{ toolbar: [[{ header: [1,2,3,false] }],[{ font: [] }],[{ size: ['small',false,'large','huge'] }],['bold','italic','underline','strike'],[{ color: [] },{ background: [] }],[{ list: 'ordered' },{ list: 'bullet' }],[{ align: [] }],['link','blockquote','code-block','image'],['clean']] }}
                  style={{ height: '300px', marginBottom: '50px' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
                <button type="submit" disabled={submitting} className="btn btn-primary">{submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}