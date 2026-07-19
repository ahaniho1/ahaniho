export default function PrivacyPage() {
  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      <section style={{ background: 'linear-gradient(135deg, #EFF6FF, #F8FAFC)', padding: '64px 0 48px', textAlign: 'center' }}>
        <div className="container">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Privacy Policy</h1>
          <p className="text-gray-500 text-lg">How we collect, use, and protect your information</p>
        </div>
      </section>
      <section className="section-sm">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="card" style={{ padding: '36px', fontSize: '15px', lineHeight: '1.8', color: '#334155' }}>
            <p className="mb-6"><strong className="text-gray-900">Last updated:</strong> July 2026</p>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
            <p className="mb-6">When you use AHA NIHO, we may collect your name and email address when you create an account or leave a comment. We also collect anonymous usage data such as pages visited and articles read to improve our platform.</p>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <p className="mb-6">Your information helps us personalize your experience, improve our content, and communicate important updates. We never sell your personal data to third parties.</p>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Cookies</h2>
            <p className="mb-6">We use essential cookies to keep you signed in and remember your preferences. You can disable cookies in your browser settings, but some features may not work properly.</p>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Comments</h2>
            <p className="mb-6">When you leave a comment, your name and comment content are publicly visible. Please do not share personal information in comments. We reserve the right to moderate or remove inappropriate comments.</p>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Data Security</h2>
            <p className="mb-6">We implement reasonable security measures to protect your information. However, no method of transmission over the internet is 100% secure.</p>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Contact</h2>
            <p>For privacy-related questions, contact us at privacy@ahan-iho.com.</p>
          </div>
        </div>
      </section>
    </div>
  );
}