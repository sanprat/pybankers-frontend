// src/react-app/pages/BlogList.tsx
import { useState, useEffect, useMemo } from 'react';
import BlogCard, { Post } from '../components/BlogCard';

const API_BASE = import.meta.env.VITE_API_URL || 'https://pyworker.pybankers.com';
const PAGE_SIZE = 9;

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/posts`)
      .then(r => r.json())
      .then((data: { results?: Post[] } | Post[]) => {
        const arr = Array.isArray(data) ? data : data.results ?? [];
        setPosts(arr);
      })
      .catch(() => setError('Failed to load posts. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return posts;
    return posts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt?.toLowerCase().includes(q)
    );
  }, [posts, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSearch(v: string) {
    setSearch(v);
    setPage(1);
  }

  return (
    <main className="page blog-list-page">
      {/* Header */}
      <div className="blog-list-header">
        <div className="blog-list-header__glow" aria-hidden />
        <div className="container">
          <div className="badge badge-primary">All Articles</div>
          <h1 className="blog-list-header__title">
            The <span className="gradient-text">PyBankers</span> Blog
          </h1>
          <p className="blog-list-header__subtitle">
            Practical Python guides for banking and finance professionals.
          </p>

          {/* Search */}
          <div className="blog-search" role="search">
            <span className="blog-search__icon" aria-hidden>🔍</span>
            <input
              id="blog-search-input"
              type="search"
              className="blog-search__input"
              placeholder="Search articles..."
              value={search}
              onChange={e => handleSearch(e.target.value)}
              aria-label="Search blog posts"
            />
            {search && (
              <button
                className="blog-search__clear"
                onClick={() => handleSearch('')}
                aria-label="Clear search"
              >✕</button>
            )}
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="container blog-list-body">
        {loading && (
          <div className="posts-loading">
            {Array.from({ length: 6 }).map((_, i) => <div className="skeleton-card" key={i} />)}
          </div>
        )}

        {error && (
          <div className="posts-error-box">
            <span>⚠️</span>
            <p>{error}</p>
            <button className="btn btn-ghost" onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="posts-empty">
            <div className="posts-empty__icon">{search ? '🔍' : '📝'}</div>
            <p>{search ? `No articles match "${search}"` : 'No posts published yet. Check back soon!'}</p>
            {search && <button className="btn btn-ghost" onClick={() => handleSearch('')}>Clear search</button>}
          </div>
        )}

        {!loading && paginated.length > 0 && (
          <>
            <div className="blog-list-count" aria-live="polite">
              {search
                ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${search}"`
                : `${posts.length} article${posts.length !== 1 ? 's' : ''}`}
            </div>
            <div className="posts-grid">
              {paginated.map(p => <BlogCard key={p.id} post={p} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination" role="navigation" aria-label="Pagination">
                <button
                  className="btn btn-ghost pagination__btn"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  aria-label="Previous page"
                >← Prev</button>

                <div className="pagination__pages">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      className={`pagination__page${page === i + 1 ? ' active' : ''}`}
                      onClick={() => setPage(i + 1)}
                      aria-label={`Page ${i + 1}`}
                      aria-current={page === i + 1 ? 'page' : undefined}
                    >{i + 1}</button>
                  ))}
                </div>

                <button
                  className="btn btn-ghost pagination__btn"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  aria-label="Next page"
                >Next →</button>
              </div>
            )}
          </>
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
