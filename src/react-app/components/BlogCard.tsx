// src/react-app/components/BlogCard.tsx
import { Link } from 'react-router-dom';

export interface Post {
  id: number;
  title: string;
  slug: string;
  content?: string;
  excerpt: string;
  author: string;
  created_at: string;
  published: number;
}

interface BlogCardProps {
  post: Post;
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link to={`/blog/${post.slug}`} className="blog-card" aria-label={`Read: ${post.title}`}>
      <div className="blog-card__meta">
        <span className="badge badge-primary">Python</span>
        <span className="blog-card__date">{formatDate(post.created_at)}</span>
      </div>

      <h2 className="blog-card__title">{post.title}</h2>

      <p className="blog-card__excerpt">{post.excerpt}</p>

      <div className="blog-card__footer">
        <div className="blog-card__author">
          <div className="blog-card__author-avatar">{getInitials(post.author || 'PB')}</div>
          <span>{post.author || 'PyBankers Team'}</span>
        </div>
        <span className="blog-card__read-more">
          Read more <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}
