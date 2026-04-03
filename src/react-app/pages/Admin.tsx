// src/react-app/pages/Admin.tsx
import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://pyworker.pybankers.com';

function getPassword(): string {
  return sessionStorage.getItem('pb_admin_pw') || '';
}

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  created_at: string;
  published: number;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ── Login Gate ──────────────────────────────────────────────
function LoginGate({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setChecking(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/posts?all=1`, {
        headers: { Authorization: `Bearer ${password}` },
      });
      if (res.ok) {
        sessionStorage.setItem('pb_admin_pw', password);
        sessionStorage.setItem('pb_admin', '1');
        onLogin();
      } else {
        setError('Incorrect password. Try again.');
        setPassword('');
      }
    } catch {
      setError('Could not connect to server.');
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="admin-login" role="main" aria-label="Admin login">
      <div className="admin-login__card">
        <div className="admin-login__icon">🔐</div>
        <h1 className="admin-login__title">Admin Access</h1>
        <p className="admin-login__subtitle">PyBankers content management</p>
        <form className="admin-login__form" onSubmit={handleSubmit}>
          <label htmlFor="admin-password" className="admin-login__label">Password</label>
          <input
            id="admin-password"
            type="password"
            className="admin-login__input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter admin password"
            autoFocus
            required
          />
          {error && <p className="admin-login__error" role="alert">{error}</p>}
          <button type="submit" className="btn btn-primary admin-login__btn" id="admin-login-submit">
            {checking ? 'Checking...' : 'Sign In →'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Main Admin Panel ─────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(sessionStorage.getItem('pb_admin') === '1');

  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [author, setAuthor] = useState('PyBankers Team');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');

  // UI state
  const [saving, setSaving] = useState(false);
  const [improving, setImproving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'posts'>('editor');

  // Auto-slug from title
  useEffect(() => {
    if (!editingId) setSlug(slugify(title));
  }, [title, editingId]);

  // Load posts
  function loadPosts() {
    setLoadingPosts(true);
    fetch(`${API_BASE}/posts?all=1`, {
      headers: { Authorization: `Bearer ${getPassword()}` },
    })
      .then(r => r.json())
      .then((data: { results?: Post[] } | Post[]) => {
        const arr = Array.isArray(data) ? data : data.results ?? [];
        setPosts(arr);
      })
      .catch(() => showMessage('error', 'Could not load posts.'))
      .finally(() => setLoadingPosts(false));
  }

  useEffect(() => {
    if (authed) loadPosts();
  }, [authed]);

  function showMessage(type: 'success' | 'error', text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  }

  function resetForm() {
    setTitle(''); setSlug(''); setExcerpt(''); setContent(''); setAuthor('PyBankers Team');
    setEditingId(null);
  }

  function loadForEdit(post: Post) {
    setEditingId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt || '');
    setContent(post.content || '');
    setAuthor(post.author || 'PyBankers Team');
    setActiveTab('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── AI Improve ──
  async function handleImprove() {
    if (!content.trim()) { showMessage('error', 'Write some content first.'); return; }
    setImproving(true);
    try {
      const res = await fetch(`${API_BASE}/admin/improve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getPassword()}` },
        body: JSON.stringify({ content, title }),
      });
      const data = await res.json() as { improved?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'AI failed');
      setContent(data.improved ?? content);
      showMessage('success', '✨ Content improved by AI!');
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'AI improve failed.');
    } finally {
      setImproving(false);
    }
  }

  // ── Save (create or update) ──
  async function handleSave(publish: boolean) {
    if (!title.trim() || !content.trim()) {
      showMessage('error', 'Title and content are required.');
      return;
    }
    setSaving(true);
    try {
      const payload = { title, slug, excerpt, content, author, published: publish ? 1 : 0 };
      const isEdit = editingId !== null;
      const res = await fetch(
        isEdit ? `${API_BASE}/admin/posts/${editingId}` : `${API_BASE}/admin/posts`,
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getPassword()}` },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Save failed');
      showMessage('success', publish ? '🚀 Post published!' : '💾 Draft saved!');
      resetForm();
      loadPosts();
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  // ── Toggle publish ──
  async function togglePublish(post: Post) {
    try {
      const res = await fetch(`${API_BASE}/admin/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getPassword()}` },
        body: JSON.stringify({ ...post, published: post.published ? 0 : 1 }),
      });
      if (!res.ok) throw new Error();
      showMessage('success', post.published ? 'Post unpublished.' : 'Post published!');
      loadPosts();
    } catch {
      showMessage('error', 'Failed to update post status.');
    }
  }

  if (!authed) return <LoginGate onLogin={() => setAuthed(true)} />;

  return (
    <main className="page admin-page" role="main" aria-label="Admin panel">
      {/* Global message */}
      {message && (
        <div className={`admin-message admin-message--${message.type}`} role="alert" aria-live="polite">
          {message.type === 'success' ? '✅' : '❌'} {message.text}
        </div>
      )}

      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <div className="badge badge-accent">Admin Panel</div>
            <h1 className="admin-title">Content Manager</h1>
            <p className="admin-subtitle">Write, improve with AI, and publish.</p>
          </div>
          <button
            className="btn btn-ghost"
            id="admin-logout"
              onClick={() => { sessionStorage.removeItem('pb_admin'); sessionStorage.removeItem('pb_admin_pw'); setAuthed(false); }}
          >Sign out</button>
        </div>

        {/* Tabs */}
        <div className="admin-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'editor'}
            className={`admin-tab${activeTab === 'editor' ? ' active' : ''}`}
            id="tab-editor"
            onClick={() => setActiveTab('editor')}
          >✍️ Editor</button>
          <button
            role="tab"
            aria-selected={activeTab === 'posts'}
            className={`admin-tab${activeTab === 'posts' ? ' active' : ''}`}
            id="tab-posts"
            onClick={() => setActiveTab('posts')}
          >📋 All Posts {posts.length > 0 && <span className="admin-tab__count">{posts.length}</span>}</button>
        </div>

        {/* ── EDITOR TAB ── */}
        {activeTab === 'editor' && (
          <div className="admin-editor" role="tabpanel" aria-labelledby="tab-editor">
            <div className="admin-editor__form">
              <div className="admin-field">
                <label htmlFor="post-title" className="admin-label">Title *</label>
                <input
                  id="post-title"
                  type="text"
                  className="admin-input"
                  placeholder="e.g. How to Use Pandas for Bank Statements"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              <div className="admin-field-row">
                <div className="admin-field">
                  <label htmlFor="post-slug" className="admin-label">Slug</label>
                  <input
                    id="post-slug"
                    type="text"
                    className="admin-input admin-input--mono"
                    placeholder="auto-generated from title"
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label htmlFor="post-author" className="admin-label">Author</label>
                  <input
                    id="post-author"
                    type="text"
                    className="admin-input"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-field">
                <label htmlFor="post-excerpt" className="admin-label">Excerpt</label>
                <input
                  id="post-excerpt"
                  type="text"
                  className="admin-input"
                  placeholder="Short summary shown in blog list..."
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  maxLength={280}
                />
                <span className="admin-field__hint">{excerpt.length}/280 characters</span>
              </div>

              <div className="admin-field">
                <div className="admin-label-row">
                  <label htmlFor="post-content" className="admin-label">Content * (HTML supported)</label>
                  <button
                    type="button"
                    id="admin-ai-improve"
                    className="btn btn-accent admin-ai-btn"
                    onClick={handleImprove}
                    disabled={improving || !content.trim()}
                    aria-label="Improve content with AI"
                  >
                    {improving ? <><span className="spinner" /> Improving…</> : '🤖 Improve with AI'}
                  </button>
                </div>
                <textarea
                  id="post-content"
                  className="admin-textarea"
                  placeholder="Write your post here... HTML tags like <h2>, <p>, <ul>, <strong> are supported."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={16}
                />
                <span className="admin-field__hint">~{Math.ceil(content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length / 200)} min read</span>
              </div>

              {/* Actions */}
              <div className="admin-actions">
                {editingId && (
                  <button type="button" className="btn btn-ghost" id="admin-cancel-edit" onClick={resetForm}>
                    Cancel edit
                  </button>
                )}
                <button
                  type="button"
                  id="admin-save-draft"
                  className="btn btn-ghost"
                  onClick={() => handleSave(false)}
                  disabled={saving}
                >
                  {saving ? <><span className="spinner" /> Saving…</> : '💾 Save Draft'}
                </button>
                <button
                  type="button"
                  id="admin-publish"
                  className="btn btn-success"
                  onClick={() => handleSave(true)}
                  disabled={saving}
                >
                  {saving ? <><span className="spinner" /> Publishing…</> : '🚀 Publish'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── POSTS TAB ── */}
        {activeTab === 'posts' && (
          <div className="admin-posts" role="tabpanel" aria-labelledby="tab-posts">
            <div className="admin-posts__actions">
              <button className="btn btn-ghost" id="admin-new-post" onClick={() => { resetForm(); setActiveTab('editor'); }}>
                + New Post
              </button>
              <button className="btn btn-ghost" id="admin-refresh-posts" onClick={loadPosts} disabled={loadingPosts}>
                {loadingPosts ? '⟳ Loading…' : '⟳ Refresh'}
              </button>
            </div>

            {loadingPosts && (
              <div className="admin-posts__loading">
                {[1,2,3].map(i => <div className="skeleton-card" key={i} style={{ height: '80px' }} />)}
              </div>
            )}

            {!loadingPosts && posts.length === 0 && (
              <div className="posts-empty">
                <div className="posts-empty__icon">📝</div>
                <p>No posts yet. Create your first one!</p>
              </div>
            )}

            {!loadingPosts && posts.length > 0 && (
              <div className="admin-posts__list">
                {posts.map(post => (
                  <div key={post.id} className="admin-post-item">
                    <div className="admin-post-item__info">
                      <div className="admin-post-item__status-row">
                        <span className={`admin-post-item__status ${post.published ? 'published' : 'draft'}`}>
                          {post.published ? '● Published' : '○ Draft'}
                        </span>
                        <span className="admin-post-item__date">{post.created_at?.split('T')[0]}</span>
                      </div>
                      <h3 className="admin-post-item__title">{post.title}</h3>
                      <p className="admin-post-item__slug">/{post.slug}</p>
                    </div>
                    <div className="admin-post-item__actions">
                      <button
                        className="btn btn-ghost"
                        id={`admin-edit-${post.id}`}
                        onClick={() => loadForEdit(post)}
                        aria-label={`Edit ${post.title}`}
                      >Edit</button>
                      <button
                        className={`btn ${post.published ? 'btn-danger' : 'btn-success'}`}
                        id={`admin-toggle-${post.id}`}
                        onClick={() => togglePublish(post)}
                        aria-label={post.published ? 'Unpublish' : 'Publish'}
                      >{post.published ? 'Unpublish' : 'Publish'}</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="footer">
        <div className="container">
          <p>PyBankers Admin · <a href="/" target="_blank" rel="noopener">View site ↗</a></p>
        </div>
      </footer>
    </main>
  );
}
