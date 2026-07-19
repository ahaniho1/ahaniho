'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role;
      if (role === 'administrator') router.push('/dashboard/admin');
      else if (role === 'publisher') router.push('/dashboard/publisher');
      else if (role === 'service_staff') router.push('/dashboard/staff');
      else router.push('/');
    } catch { router.push('/login'); }
  }, []);

  return <div style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>Redirecting...</div>;
}