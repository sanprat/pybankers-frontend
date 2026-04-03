-- PyBankers D1 Database Schema
-- Run: npx wrangler d1 execute pybankers-db --file=schema.sql --remote

CREATE TABLE IF NOT EXISTS posts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT    NOT NULL,
  slug       TEXT    UNIQUE NOT NULL,
  content    TEXT,
  excerpt    TEXT    DEFAULT '',
  author     TEXT    DEFAULT 'PyBankers Team',
  created_at TEXT    DEFAULT (datetime('now')),
  published  INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_posts_slug      ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_created   ON posts(created_at DESC);

-- Seed: sample post so the site doesn't look empty
INSERT OR IGNORE INTO posts (title, slug, content, excerpt, author, published)
VALUES (
  'How to Build Your First AI Product Without Writing Code',
  'build-first-ai-product-no-code',
  '<h2>What We''re Going to Build</h2>
<p>You''re going to build a real, working product today. No Python. No JavaScript. No tech degree required.</p>
<p>This guide will show you, step by step, how to use <strong>AI tools</strong> to create something useful — the kind of thing that used to take a developer months to build.</p>

<h2>The Tools You Need</h2>
<ul>
  <li><strong>ChatGPT or Claude</strong> — Your AI co-pilot. Handles complex thinking and writing.</li>
  <li><strong>Bolt.new or Lovable</strong> — Turns your ideas into working apps instantly.</li>
  <li><strong>Cloudflare</strong> — Hosts your product for free, globally fast.</li>
</ul>

<h2>Step 1: Define What You Want to Build</h2>
<p>The clearest possible description of what you want is your most important starting point. Don''t say "I want an app." Say:</p>
<blockquote>"I want a simple tool where I can paste a bank statement and it gives me a summary of where my money went."</blockquote>
<p>That''s a real prompt. That''s buildable. Right now. Today.</p>

<h2>Step 2: Let AI Generate the App</h2>
<p>Go to <strong>Bolt.new</strong>. Paste your description. Click run. Watch it build a working app in front of you.</p>
<p>If something is wrong, just type what you want changed. The AI adjusts it. You keep refining until it''s right.</p>

<h2>Step 3: Deploy It</h2>
<p>Once you''re happy, Bolt gives you a public link or lets you deploy to Cloudflare Pages. One click. That''s it. Your product is live.</p>

<h2>What You Just Did</h2>
<p>You built and shipped a product — without writing a single line of code. This is what PyBankers is all about.</p>
<p><strong>The future of work belongs to people who know how to use AI.</strong> Not to people who know how to code.</p>',
  'Learn how to build a real, working product using AI tools — no coding required. Step-by-step guide for professionals.',
  'PyBankers Team',
  1
);
