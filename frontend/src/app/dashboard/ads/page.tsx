'use client';
import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const CLOUDINARY_CLOUD = 'dlxiuwv30';
const CLOUDINARY_PRESET = 'wbico_products';

export default function DashboardAdsPage() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '', type: 'image', content: '', imageUrl: '', pdfUrl: '', videoUrl: '',
    externalUrl: '', whatsappNumber: '', position: 'sidebar', startDate: '', endDate: '', status: 'draft'
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchAds(); }, []);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const fetchAds = async () => {
    try {
      const res = await fetch(`${API_URL}/advertisements`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setAds(Array.isArray(data) ? data : []);
    } catch {} finally { setLoading(false); }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', CLOUDINARY_PRESET);
    fd.append('cloud_name', CLOUDINARY_CLOUD);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/auto/upload`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.secure_url) setForm({ ...form, [field]: data.secure_url });
    } catch {}
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const url = editingId ? `${API_URL}/advertisements/${editingId}` : `${API_URL}/advertisements`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Failed');
      setShowForm(false); setEditingId(null);
      setForm({ title: '', type: 'image', content: '', imageUrl: '', pdfUrl: '', videoUrl: '', externalUrl: '', whatsappNumber: '', position: 'sidebar', startDate: '', endDate: '', status: 'draft' });
      fetchAds();
    } catch { setError('Failed to save ad'); }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this ad?')) return;
    await fetch(`${API_URL}/advertisements/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchAds();
  };

  const typeLabels: Record<string, string> = { image: 'Image', video: 'Video', text: 'Text', quick_info: 'Quick Info', pdf: 'PDF', banner: 'Banner' };
  const statusColors: Record<string, string> = { active: '#10B981', inactive: '#F59E0B', expired: '#EF4444', draft: '#94A3B8' };

  if (loading) return (
    <div className="p-8 flex items-center justify-center" style={{minHeight:'60vh'}}>
      <div style={{textAlign:'center',color:'#94A3B8'}}>
        <div style={{width:'32px',height:'32px',border:'3px solid #E2E8F0',borderTopColor:'#2563EB',borderRadius:'50%',animation:'spin 0.6s linear infinite',margin:'0 auto 12px'}}></div>
        <p className="text-sm">Loading ads...</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 lg:p-8">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advertisements</h1>
          <p className="text-gray-500 text-sm mt-1">Manage platform advertisements and placements</p>
        </div>
        <button onClick={() => { setEditingId(null); setForm({ title: '', type: 'image', content: '', imageUrl: '', pdfUrl: '', videoUrl: '', externalUrl: '', whatsappNumber: '', position: 'sidebar', startDate: '', endDate: '', status: 'draft' }); setShowForm(true); }} className="btn btn-primary">+ New Ad</button>
      </div>

      {/* Ads Table */}
      {ads.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '64px 24px' }}>
          <div style={{ width: '56px', height: '56px', background: '#F1F5F9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#94A3B8' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
          </div>
          <p className="text-gray-500 font-medium">No advertisements yet</p>
          <p className="text-gray-400 text-sm mt-1">Create your first ad to start monetizing.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
         <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
  <thead>
    <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
      <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</th>
      <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
      <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Position</th>
      <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
      <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duration</th>
      <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
    </tr>
  </thead>
  <tbody>
    {ads.map((ad: any) => (
      <tr key={ad._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
        <td style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {ad.imageUrl ? (
              <img src={ad.imageUrl} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
            ) : (
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#94A3B8' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832"/></svg>
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900 text-sm">{ad.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{ad.type === 'quick_info' ? 'Quick Info' : ad.type === 'external_link' ? 'External Link' : ad.type?.charAt(0).toUpperCase() + ad.type?.slice(1)}</p>
            </div>
          </div>
        </td>
        <td style={{ padding: '14px 16px' }}>
          <span className="badge badge-blue" style={{ fontSize: '11px' }}>{typeLabels[ad.type] || ad.type}</span>
        </td>
        <td style={{ padding: '14px 16px' }}>
          <span style={{ fontSize: '13px', color: '#475569', fontWeight: 500, textTransform: 'capitalize' }}>{ad.position?.replace(/_/g, ' ')}</span>
        </td>
        <td style={{ padding: '14px 16px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: statusColors[ad.status] || '#94A3B8' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: statusColors[ad.status] || '#94A3B8' }}></span>
            {ad.status?.charAt(0).toUpperCase() + ad.status?.slice(1)}
          </span>
        </td>
        <td style={{ padding: '14px 16px' }}>
          <div>
            <p style={{ fontSize: '13px', color: '#334155' }}>{ad.startDate?.split('T')[0]}</p>
            <p style={{ fontSize: '11px', color: '#94A3B8' }}>→ {ad.endDate?.split('T')[0] || 'Ongoing'}</p>
          </div>
        </td>
        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
            <button onClick={() => { setEditingId(ad._id); setForm({ title: ad.title, type: ad.type, content: ad.content||'', imageUrl: ad.imageUrl||'', pdfUrl: ad.pdfUrl||'', videoUrl: ad.videoUrl||'', externalUrl: ad.externalUrl||'', whatsappNumber: ad.whatsappNumber||'', position: ad.position, startDate: ad.startDate?.split('T')[0]||'', endDate: ad.endDate?.split('T')[0]||'', status: ad.status }); setShowForm(true); }}
              style={{ padding: '6px 14px', background: '#EFF6FF', color: '#2563EB', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Edit</button>
            <button onClick={() => handleDelete(ad._id)}
              style={{ padding: '6px 14px', background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
                 </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="modal-box" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Advertisement' : 'New Advertisement'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4 border border-red-100">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title *</label>
                <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input" placeholder="Ad title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Type *</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="select">
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="text">Text</option>
                    <option value="quick_info">Quick Info</option>
                    <option value="pdf">PDF</option>
                    <option value="banner">Banner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Position *</label>
                  <select value={form.position} onChange={e => setForm({...form, position: e.target.value})} className="select">
                    <option value="sidebar">Sidebar</option>
                    <option value="home_banner">Home Banner</option>
                    <option value="between_articles">Between Articles</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="select">
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">WhatsApp Number</label>
                  <input type="text" value={form.whatsappNumber} onChange={e => setForm({...form, whatsappNumber: e.target.value})} className="input" placeholder="+250780000000" />
                </div>
              </div>
              {(form.type === 'image' || form.type === 'banner') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Upload Image</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input type="file" accept="image/*" onChange={e => handleUpload(e, 'imageUrl')} className="input" style={{flex:1}} />
                    {uploading && <span className="text-xs text-blue-600">Uploading...</span>}
                  </div>
                  {form.imageUrl && <img src={form.imageUrl} alt="" className="mt-2 h-20 rounded-lg border" />}
                  <input type="text" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} className="input mt-2" placeholder="Or paste image URL" />
                </div>
              )}
              {form.type === 'video' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Upload Video</label>
                  <input type="file" accept="video/*" onChange={e => handleUpload(e, 'videoUrl')} className="input" />
                  {uploading && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
                  <input type="text" value={form.videoUrl} onChange={e => setForm({...form, videoUrl: e.target.value})} className="input mt-2" placeholder="Or paste video URL" />
                </div>
              )}
              {form.type === 'pdf' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Upload PDF</label>
                  <input type="file" accept=".pdf" onChange={e => handleUpload(e, 'pdfUrl')} className="input" />
                  {uploading && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
                  <input type="text" value={form.pdfUrl} onChange={e => setForm({...form, pdfUrl: e.target.value})} className="input mt-2" placeholder="Or paste PDF URL" />
                </div>
              )}
              {(form.type === 'text' || form.type === 'quick_info') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Content</label>
                  <textarea rows={4} value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="textarea" placeholder="Ad text content..." />
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">External Link (optional)</label>
                <input type="text" value={form.externalUrl} onChange={e => setForm({...form, externalUrl: e.target.value})} className="input" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Date *</label>
                  <input type="date" required value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Date</label>
                  <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="input" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting} className="btn btn-primary">{submitting ? 'Saving...' : editingId ? 'Update Ad' : 'Create Ad'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}