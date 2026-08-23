import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { SchematicMark } from "@/components/graphics/SchematicMark";
import { getPost } from "@/lib/posts";
import { getResearchDomain, researchDomains } from "@/lib/research";

export function generateStaticParams() {
  return researchDomains.map((domain) => ({ slug: domain.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const domain = getResearchDomain(slug);
  if (!domain) return {};

  return {
    title: `${domain.title} — Digital Wilderness`,
    description: domain.summary,
  };
}

export default async function ResearchDomainPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const domain = getResearchDomain(slug);
  if (!domain) notFound();

  const domainIndex = researchDomains.findIndex((d) => d.slug === slug);
  const relatedPost = domain.relatedPostSlug ? getPost(domain.relatedPostSlug) : undefined;

  return (
    <main id="main-content">
      <section className="section page-hero">
        <div className="container grid-12">
          <div className="page-hero-content">
            <Link href="/#research" className="post-back">
              ← Research
            </Link>
            <div className="post-header">
              <span className="kicker">{domain.index} — Research Track</span>
              <h1>{domain.title}</h1>
            </div>
            <p>{domain.summary}</p>
            <div className="page-hero-tracks">
              {domain.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>

          <div className="page-hero-art">
            <SchematicMark variant={domainIndex} />
          </div>
        </div>
      </section>

      <article className="section post-page">
        <div className="container grid-12">
          <div className="post">
            <div className="post-body">
              {domain.sections.map((section, i) => (
                <Fragment key={section.heading ?? i}>
                  {section.heading && <h2>{section.heading}</h2>}
                  {section.paragraphs.map((paragraph, j) => (
                    <p key={j}>{paragraph}</p>
                  ))}
                </Fragment>
              ))}
            </div>

            {relatedPost && (
              <nav className="post-nav" aria-label="Related reading">
                <Link href={`/blog/${relatedPost.slug}`} className="post-nav-link">
                  <span className="label">Related reading</span>
                  <span className="title">{relatedPost.title}</span>
                </Link>
              </nav>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}
