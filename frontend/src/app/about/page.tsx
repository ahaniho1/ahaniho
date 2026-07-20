export default function AboutPage() {
  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      <section style={{ background: 'linear-gradient(135deg, #EFF6FF, #F8FAFC)', padding: '64px 0 48px', textAlign: 'center' }}>
        <div className="container">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">About Aha Secret Max</h1>
          <p className="text-gray-500 text-lg">Our mission, vision, and the team behind the platform</p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="card" style={{ marginBottom: '28px', padding: '36px' }}>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Aha Secret Max is a professional content publishing platform dedicated to elevating knowledge across three transformative disciplines: <strong className="text-gray-900">Artificial Intelligence</strong>, <strong className="text-gray-900">Psychology</strong>, and <strong className="text-gray-900">Financial Literacy</strong>.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe that access to quality information should be free and available to everyone. Our platform brings together expert writers, researchers, and thought leaders to share insights that can change lives.
            </p>
          </div>

          <div className="card" style={{ marginBottom: '28px', padding: '36px' }}>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">What We Cover</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M12 8v4l3 3"/></svg>
                </div>
                <h3 className="font-bold mb-2 text-gray-900">AI Training</h3>
                <p className="text-sm text-gray-500">Machine learning, neural networks, prompt engineering, and the future of technology.</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="5" r="3"/><path d="M12 22V8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>
                </div>
                <h3 className="font-bold mb-2 text-gray-900">Psychology Facts</h3>
                <p className="text-sm text-gray-500">Human behavior, cognitive science, emotional intelligence, and mental wellness.</p>
              </div>
              <div className="text-center p-6 bg-amber-50 rounded-xl">
                <div className="w-14 h-14 bg-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <h3 className="font-bold mb-2 text-gray-900">Financial Literacy</h3>
                <p className="text-sm text-gray-500">Investing, budgeting, wealth building, and personal finance mastery.</p>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '36px' }}>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Join Us</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Whether you are a reader seeking knowledge or a writer wanting to share your expertise, Aha Secret Max welcomes you.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our platform is built by <strong className="text-gray-900">Niroflixx</strong>, committed to creating professional digital experiences.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}