// src/react-app/pages/BlogDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Post } from '../components/BlogCard';

const API_BASE = import.meta.env.VITE_API_URL || 'https://pyworker.pybankers.com';

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch { return dateStr; }
}

function estimateReadTime(content: string) {
  const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`${API_BASE}/api/posts/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then((data: Post) => setPost(data))
      .catch(() => setError('Post not found or could not be loaded.'))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <main className="page blog-detail-page">
      <div className="blog-detail-container">
        {/* Back navigation */}
        <button className="blog-detail__back btn btn-ghost" onClick={() => navigate(-1)} id="blog-back-btn">
          ← Back to Blog
        </button>

        {loading && (
          <div className="blog-detail-skeleton">
            <div className="skeleton skeleton--title" />
            <div className="skeleton skeleton--meta" />
            <div className="skeleton skeleton--body" />
            <div className="skeleton skeleton--body" />
            <div className="skeleton skeleton--body" />
          </div>
        )}

        {error && (
          <div className="blog-detail-error">
            <div className="blog-detail-error__icon">🔍</div>
            <h2>Post not found</h2>
            <p>{error}</p>
            <Link to="/blog" className="btn btn-primary" id="blog-detail-error-back">Browse all posts</Link>
          </div>
        )}

        {!loading && !error && post && (
          <article className="blog-article" aria-label={post.title}>
            {/* Article Header */}
            <header className="blog-article__header">
              <div className="blog-article__meta-top">
                <span className="badge badge-primary">Python</span>
                <span className="blog-article__date">{formatDate(post.created_at)}</span>
                <span className="blog-article__read-time">
                  ☕ {estimateReadTime(post.content ?? post.excerpt ?? '')} min read
                </span>
              </div>

              <h1 className="blog-article__title">{post.title}</h1>

              {post.excerpt && (
                <p className="blog-article__excerpt">{post.excerpt}</p>
              )}

              <div className="blog-article__author-row">
                <div className="blog-article__author-avatar">
                  {(post.author || 'PB').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <p className="blog-article__author-name">{post.author || 'PyBankers Team'}</p>
                  <p className="blog-article__author-role">Content Creator</p>
                </div>
              </div>
            </header>

            {/* Divider */}
            <div className="blog-article__divider" aria-hidden />

            {/* Content */}
            <div
              className="blog-article__content"
              dangerouslySetInnerHTML={{ __html: post.content ?? '<p>Content coming soon.</p>' }}
            />

            {/* Footer */}
            <footer className="blog-article__footer">
              <p className="blog-article__footer-text">
                Found this helpful? Share it with a colleague!
              </p>
              <div className="blog-article__footer-actions">
                <Link to="/blog" className="btn btn-ghost" id="blog-detail-browse">
                  ← More articles
                </Link>
                <button
                  className="btn btn-primary"
                  id="blog-detail-share"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied!');
                  }}
                >
                  🔗 Copy link
                </button>
              </div>
            </footer>
          </article>
        )}
      </div>

      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} <strong>PyBankers</strong> · Learn Python for Finance</p>
        </div>
      </footer>
    </main>
  );
}
