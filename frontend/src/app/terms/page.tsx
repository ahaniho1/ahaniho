export default function TermsPage() {
  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      <section style={{ background: 'linear-gradient(135deg, #EFF6FF, #F8FAFC)', padding: '64px 0 48px', textAlign: 'center' }}>
        <div className="container">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Terms of Service</h1>
          <p className="text-gray-500 text-lg">Rules and guidelines for using Aha Secret Max</p>
        </div>
      </section>
      <section className="section-sm">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="card" style={{ padding: '36px', fontSize: '15px', lineHeight: '1.8', color: '#334155' }}>
            <p className="mb-6"><strong className="text-gray-900">Last updated:</strong> July 2026</p>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p className="mb-6">By accessing and using Aha Secret Max, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.</p>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Content</h2>
            <p className="mb-6">Content published on Aha Secret Max is for educational and informational purposes only. Authors are responsible for their published articles.</p>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. User Conduct</h2>
            <p className="mb-6">Users agree to post respectful comments and not engage in harassment, spam, or illegal activities. We reserve the right to suspend or terminate accounts that violate these terms.</p>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Intellectual Property</h2>
            <p className="mb-6">Authors retain rights to their content. By publishing on Aha Secret Max, you grant us a license to display your content on our platform.</p>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Limitation of Liability</h2>
            <p className="mb-6">Aha Secret Max is provided as-is. We are not liable for any damages arising from the use of our platform.</p>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Changes to Terms</h2>
            <p>We may update these terms periodically. Continued use constitutes acceptance of the new terms.</p>
          </div>
        </div>
      </section>
    </div>
  );
}