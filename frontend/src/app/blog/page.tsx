import type { Metadata } from "next";
import Link from "next/link";
import { SchematicMark } from "@/components/graphics/SchematicMark";
import { getSortedPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog — Digital Wilderness",
  description:
    "Notes from the lab — write-ups on what we're researching, as it happens.",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const posts = getSortedPosts();

  return (
    <main id="main-content">
      <section className="section page-hero">
        <div className="container grid-12">
          <div className="page-hero-content">
            <span className="kicker">Blog</span>
            <h1>Notes from the lab.</h1>
            <p>
              Write-ups on what we&apos;re researching, published as it
              happens rather than after the fact — including the work that
              isn&apos;t finished yet.
            </p>
          </div>

          <div className="page-hero-art">
            <SchematicMark variant={2} />
          </div>
        </div>
      </section>

      <section className="section blog-list">
        <div className="container grid-12">
          <div className="blog-grid">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
                <span className="date">{formatDate(post.date)}</span>
                <h3>{post.title}</h3>
                <p className="excerpt">{post.excerpt}</p>
                <span className="read-more">Read more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
