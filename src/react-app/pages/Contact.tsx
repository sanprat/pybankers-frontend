// src/react-app/pages/Contact.tsx
import { Link } from 'react-router-dom';

export default function Contact() {
  return (
    <main className="page contact-page">
      {/* Header */}
      <section className="contact-hero">
        <div className="contact-hero__glow" aria-hidden />
        <div className="container">
          <div className="badge badge-primary">Get in Touch</div>
          <h1 className="contact-hero__title">
            Contact <span className="gradient-text">PyBankers</span>
          </h1>
          <p className="contact-hero__subtitle">
            Have a question, suggestion, or want to collaborate? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <a href="https://mail.google.com/mail/?to=sanprat@pybankers.com" target="_blank" rel="noopener noreferrer" className="contact-card" aria-label="Email us">
              <div className="contact-card__icon">📧</div>
              <h3 className="contact-card__title">Email</h3>
              <p className="contact-card__desc">sanprat@pybankers.com</p>
              <span className="contact-card__action">Send an email →</span>
            </a>

            <a href="https://x.com/pybankers" target="_blank" rel="noopener noreferrer" className="contact-card" aria-label="Follow us on X">
              <div className="contact-card__icon">🐦</div>
              <h3 className="contact-card__title">X (Twitter)</h3>
              <p className="contact-card__desc">@pybankers</p>
              <span className="contact-card__action">Follow us →</span>
            </a>

            <a href="https://www.linkedin.com/in/sanprat-pybankers-a594b0405/" target="_blank" rel="noopener noreferrer" className="contact-card" aria-label="Connect on LinkedIn">
              <div className="contact-card__icon">💼</div>
              <h3 className="contact-card__title">LinkedIn</h3>
              <p className="contact-card__desc">PyBankers</p>
              <span className="contact-card__action">Connect →</span>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="contact-section contact-section--alt">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-accent">Common questions</span>
            <h2 className="section-title">FAQ</h2>
          </div>
          <div className="contact-faq">
            <div className="contact-faq-item">
              <h3 className="contact-faq-item__q">Is PyBankers free?</h3>
              <p className="contact-faq-item__a">
                Yes. All guides and blog posts are completely free. We believe in making
                AI skills accessible to everyone.
              </p>
            </div>
            <div className="contact-faq-item">
              <h3 className="contact-faq-item__q">Do I need to know how to code?</h3>
              <p className="contact-faq-item__a">
                No. That's the whole point. Our guides are designed for professionals who
                want to build products using AI — zero coding experience needed.
              </p>
            </div>
            <div className="contact-faq-item">
              <h3 className="contact-faq-item__q">Can I contribute a guest post?</h3>
              <p className="contact-faq-item__a">
                Absolutely. Send us an email with your topic idea and a brief outline.
                We love featuring real-world AI use cases from the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="contact-cta">
        <div className="container">
          <div className="cta-banner">
            <div className="cta-banner__glow" aria-hidden />
            <h2 className="cta-banner__title">Start building today</h2>
            <p className="cta-banner__subtitle">
              Explore our guides and launch your first AI-powered product.
            </p>
            <Link to="/blog" className="btn btn-primary" id="contact-cta-blog">
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
