const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function fetchPublishedArticles(limit = 10) {
  const res = await fetch(`${API_URL}/articles?limit=${limit}`);
  const data = await res.json();
  return Array.isArray(data) ? data : data?.articles || [];
}

export async function fetchArticle(slug: string) {
  const res = await fetch(`${API_URL}/articles/${slug}`);
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_URL}/categories`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function likeArticle(id: string) {
  const fingerprint = typeof window !== 'undefined'
    ? localStorage.getItem('deviceFingerprint') || Math.random().toString(36).substring(2)
    : 'server';
  if (typeof window !== 'undefined') localStorage.setItem('deviceFingerprint', fingerprint);

  const res = await fetch(`${API_URL}/articles/${id}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceFingerprint: fingerprint }),
  });
  return res.json();
}

export async function trackView(id: string) {
  const sessionId = typeof window !== 'undefined'
    ? localStorage.getItem('sessionId') || Math.random().toString(36).substring(2)
    : 'server';
  if (typeof window !== 'undefined') localStorage.setItem('sessionId', sessionId);

  await fetch(`${API_URL}/articles/${id}/view`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  });
}