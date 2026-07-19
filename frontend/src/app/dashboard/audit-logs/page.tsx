'use client';
import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function DashboardAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/audit-logs`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setLogs(Array.isArray(d) ? d : [])).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>Loading...</div>;

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Audit Logs</h1>
      <p className="text-gray-500 text-sm mb-8">Immutable record of all system actions</p>
      {logs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '64px' }}>
          <p className="text-gray-500">No audit logs recorded yet.</p>
          <p className="text-gray-400 text-sm mt-1">System actions will appear here automatically.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead><tr style={{ borderBottom: '2px solid #E2E8F0' }}>
              <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>User</th>
              <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Action</th>
              <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Entity</th>
              <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Date</th>
            </tr></thead>
            <tbody>
              {logs.map((log: any) => (
                <tr key={log._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 500 }}>{log.userId?.firstName || 'System'} {log.userId?.lastName || ''}</td>
                  <td style={{ padding: '14px 16px' }}><span className="badge badge-blue" style={{ fontSize: '11px' }}>{log.action?.replace(/_/g, ' ')}</span></td>
                  <td style={{ padding: '14px 16px', color: '#64748B', fontSize: '13px' }}>{log.entityType}</td>
                  <td style={{ padding: '14px 16px', color: '#64748B', fontSize: '12px' }}>{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p style={{ textAlign: 'center', fontSize: '11px', color: '#94A3B8', marginTop: '16px' }}>Audit logs are immutable and cannot be edited or deleted.</p>
    </div>
  );
}