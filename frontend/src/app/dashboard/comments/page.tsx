'use client';
import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function DashboardCommentsPage() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchComments(); }, []);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const fetchComments = async () => {
    try {
      const res = await fetch(`${API_URL}/comments`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setComments(Array.isArray(data) ? data : data?.comments || data?.data || []);
    } catch {}
    setLoading(false);
  };

  const handleToggle = async (comment: any) => {
    const newStatus = comment.status === 'visible' ? 'hidden' : 'visible';
    try {
      await fetch(`${API_URL}/comments/${comment._id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchComments();
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this comment?')) return;
    try {
      await fetch(`${API_URL}/comments/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchComments();
    } catch {}
  };

  if (loading) return <div className="p-8 flex items-center justify-center"><div className="text-gray-400">Loading comments...</div></div>;

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-1">Comments</h1>
      <p className="text-gray-500 text-sm mb-8">Moderate user comments</p>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-xs">Author</th>
              <th className="text-left px-5 py-3 font-semibold text-xs">Content</th>
              <th className="text-left px-5 py-3 font-semibold text-xs">Status</th>
              <th className="text-left px-5 py-3 font-semibold text-xs">Date</th>
              <th className="text-left px-5 py-3 font-semibold text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-gray-400">No comments yet.</td></tr>
            ) : (
              comments.map((c: any) => (
                <tr key={c._id} className="border-t hover:bg-gray-50">
                  <td className="px-5 py-3.5 font-medium">{c.authorName}</td>
                  <td className="px-5 py-3.5 max-w-xs truncate text-xs text-gray-600">{c.content}</td>
                  <td className="px-5 py-3.5"><span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${c.status === 'visible' ? 'bg-green-100 text-green-700' : c.status === 'hidden' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>{c.status}</span></td>
                  <td className="px-5 py-3.5 text-xs text-gray-500">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '-'}</td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => handleToggle(c)} className="text-orange-500 hover:underline text-xs font-semibold mr-3">
                      {c.status === 'visible' ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={() => handleDelete(c._id)} className="text-red-500 hover:underline text-xs font-semibold">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}