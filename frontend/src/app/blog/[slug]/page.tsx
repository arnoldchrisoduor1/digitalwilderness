import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { getAdjacentPosts, getPost, posts } from "@/lib/posts";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} — Digital Wilderness`,
    description: post.excerpt,
  };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { prev, next } = getAdjacentPosts(slug);

  return (
    <main id="main-content">
      <article className="section post-page">
        <div className="container grid-12">
          <div className="post">
            <Link href="/blog" className="post-back">
              ← All posts
            </Link>

            <header className="post-header">
              <span className="date">{formatDate(post.date)}</span>
              <h1>{post.title}</h1>
            </header>

            <div className="post-body">
              {post.sections.map((section, i) => (
                <Fragment key={section.heading ?? i}>
                  {section.heading && <h2>{section.heading}</h2>}
                  {section.paragraphs.map((paragraph, j) => (
                    <p key={j}>{paragraph}</p>
                  ))}
                </Fragment>
              ))}
            </div>

            {(prev || next) && (
              <nav className="post-nav" aria-label="More posts">
                {prev ? (
                  <Link href={`/blog/${prev.slug}`} className="post-nav-link prev">
                    <span className="label">← Previous</span>
                    <span className="title">{prev.title}</span>
                  </Link>
                ) : (
                  <span />
                )}
                {next && (
                  <Link href={`/blog/${next.slug}`} className="post-nav-link next">
                    <span className="label">Next →</span>
                    <span className="title">{next.title}</span>
                  </Link>
                )}
              </nav>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}
