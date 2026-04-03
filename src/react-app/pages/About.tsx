// src/react-app/pages/About.tsx
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <main className="page about-page">
      {/* Header */}
      <section className="about-hero">
        <div className="about-hero__glow" aria-hidden />
        <div className="container">
          <div className="badge badge-primary">About Us</div>
          <h1 className="about-hero__title">
            We teach you to build with <span className="gradient-text">AI, not code</span>
          </h1>
          <p className="about-hero__subtitle">
            PyBankers is a learning platform for banking and finance professionals
            who want to leverage AI tools to build real products — no programming required.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-card">
              <div className="about-card__icon">🎯</div>
              <h3 className="about-card__title">Our Mission</h3>
              <p className="about-card__desc">
                Make product-building accessible to everyone. You don't need to learn Python
                or JavaScript — you need to learn how to talk to AI tools that write the code for you.
              </p>
            </div>
            <div className="about-card">
              <div className="about-card__icon">🤖</div>
              <h3 className="about-card__title">AI-First Approach</h3>
              <p className="about-card__desc">
                Every guide on this site uses AI tools like ChatGPT, Claude, Bolt.new,
                and Cloudflare. We teach you the prompts, workflows, and strategies that actually work.
              </p>
            </div>
            <div className="about-card">
              <div className="about-card__icon">🏗️</div>
              <h3 className="about-card__title">Real Products</h3>
              <p className="about-card__desc">
                We don't teach theory. Every article ends with a working product you can
                deploy. From internal tools to client-facing apps — if you can describe it, you can build it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="about-section about-section--alt">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-accent">How it works</span>
            <h2 className="section-title">Three steps to building anything</h2>
          </div>
          <div className="about-steps">
            <div className="about-step">
              <div className="about-step__number">1</div>
              <div>
                <h3 className="about-step__title">Describe what you want</h3>
                <p className="about-step__desc">
                  Write a clear description of the tool, app, or automation you need.
                  No technical language required.
                </p>
              </div>
            </div>
            <div className="about-step">
              <div className="about-step__number">2</div>
              <div>
                <h3 className="about-step__title">Let AI build it</h3>
                <p className="about-step__desc">
                  Paste your description into Bolt.new, Lovable, or ChatGPT.
                  The AI generates a working app in seconds.
                </p>
              </div>
            </div>
            <div className="about-step">
              <div className="about-step__number">3</div>
              <div>
                <h3 className="about-step__title">Deploy and share</h3>
                <p className="about-step__desc">
                  Push your product to Cloudflare, Vercel, or any hosting platform.
                  One click. Live on the internet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-banner">
            <div className="cta-banner__glow" aria-hidden />
            <h2 className="cta-banner__title">Ready to start building?</h2>
            <p className="cta-banner__subtitle">
              Browse our guides and build your first AI-powered product today.
            </p>
            <Link to="/blog" className="btn btn-primary" id="about-cta-blog">
              📖 Read the Blog
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} <strong>PyBankers</strong> · Build with AI, not code</p>
        </div>
      </footer>
    </main>
  );
}
