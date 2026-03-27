import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogPosts, getBlogPostBySlug } from "@/lib/blog";
import ScrollToTop from "@/components/ScrollToTop";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) notFound();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-[56px]">
        <ScrollToTop />
        <article className="mx-auto max-w-3xl px-[30px] pt-16 pb-24 lg:pt-24">
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[13px] text-black/40 hover:text-black transition-colors mb-10"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            Volver al blog
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-[13px] text-black/40">
              {new Date(post.date).toLocaleDateString("es-AR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="text-black/20">&middot;</span>
            <span className="text-[13px] text-black/40">{post.author}</span>
          </div>

          {/* Title */}
          <h1 className="text-[36px] lg:text-[48px] font-bold leading-[1.05] mb-4">
            {post.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-10">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-black/5 text-black/50 text-[12px] font-medium capitalize"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Cover */}
          {post.coverImage && (
            <div className="aspect-[2/1] rounded-2xl overflow-hidden mb-10">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="space-y-6">
            {post.content.map((paragraph, i) => (
              <p
                key={i}
                className="text-[17px] leading-[1.8] text-black/75 lg:text-[18px]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
