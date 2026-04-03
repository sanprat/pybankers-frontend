// src/react-app/pages/Home.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogCard, { Post } from '../components/BlogCard';

const API_BASE = import.meta.env.VITE_API_URL || 'https://pyworker.pybankers.com';

const FEATURES = [
  { icon: '🤖', title: 'AI Tools', desc: 'ChatGPT, Claude, Gemini — learn to use them to build real things.' },
  { icon: '🏗️', title: 'Build Products', desc: 'Launch apps, tools, and automations without writing a single line of code.' },
  { icon: '⚡', title: 'No Coding Needed', desc: 'We focus on what AI can do for you, not on programming syntax.' },
  { icon: '🎓', title: 'Structured Guides', desc: 'Step-by-step tutorials anyone can follow, from idea to live product.' },
];

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/posts`)
      .then(r => r.json())
      .then((data: { results?: Post[] } | Post[]) => {
        const arr = Array.isArray(data) ? data : data.results ?? [];
        setPosts(arr.slice(0, 3));
      })
      .catch(() => setError('Could not load posts.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page home-page">
      {/* ── Hero ── */}
      <section className="hero" aria-label="Hero section">
        <div className="hero__glow" aria-hidden />
        <div className="container">
          <div className="hero__content">
            <div className="badge badge-primary hero__badge">
              <span>✦</span> No Code. Just AI.
            </div>
            <h1 className="hero__title">
              Build real products{' '}
              <span className="gradient-text">using AI tools</span>
            </h1>
            <p className="hero__subtitle">
              No coding. No tech degree. Just learn to use AI the right way —
              and build things you didn't think were possible.
            </p>
            <div className="hero__actions">
              <Link to="/blog" className="btn btn-primary hero__btn" id="hero-start-reading">
                📖 Start Reading
              </Link>
              <a href="#features" className="btn btn-ghost" id="hero-learn-more">
                See what you'll learn ↓
              </a>
            </div>
            <div className="hero__stats">
              <div className="hero__stat"><span>0</span><p>Lines of Code</p></div>
              <div className="hero__stat-divider" />
              <div className="hero__stat"><span>Free</span><p>Always Free</p></div>
              <div className="hero__stat-divider" />
              <div className="hero__stat"><span>AI</span><p>AI-First Guides</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="features-section" aria-label="Features">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-accent">What you'll learn</span>
            <h2 className="section-title">Build anything using AI</h2>
            <p className="section-subtitle">
              No jargon. No coding. Just powerful AI tools that help you build products and automate your work.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map(f => (
              <div className="feature-card" key={f.title}>
                <div className="feature-card__icon">{f.icon}</div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest Posts ── */}
      <section className="latest-posts-section" aria-label="Latest blog posts">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-primary">Fresh content</span>
            <h2 className="section-title">Latest from the blog</h2>
            <p className="section-subtitle">AI-written and human-reviewed guides — clear, practical, and actionable.</p>
          </div>

          {loading && (
            <div className="posts-loading">
              {[1,2,3].map(i => <div className="skeleton-card" key={i} />)}
            </div>
          )}
          {error && <p className="posts-error">{error}</p>}
          {!loading && !error && posts.length === 0 && (
            <div className="posts-empty">
              <div className="posts-empty__icon">📝</div>
              <p>No posts published yet. Check back soon!</p>
            </div>
          )}
          {!loading && posts.length > 0 && (
            <div className="posts-grid">
              {posts.map(p => <BlogCard key={p.id} post={p} />)}
            </div>
          )}

          <div className="latest-posts__cta">
            <Link to="/blog" className="btn btn-ghost" id="home-view-all-posts">
              View all posts →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-section" aria-label="Call to action">
        <div className="container">
          <div className="cta-banner">
            <div className="cta-banner__glow" aria-hidden />
            <h2 className="cta-banner__title">Ready to build with AI?</h2>
            <p className="cta-banner__subtitle">
              Join professionals using PyBankers to build real products — powered entirely by AI.
            </p>
            <Link to="/blog" className="btn btn-primary" id="cta-read-blog">
              📖 Read the Blog
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} <strong>PyBankers</strong> · Build with AI, not code &nbsp;·&nbsp; <Link to="/admin">Admin</Link></p>
        </div>
      </footer>
    </main>
  );
}
