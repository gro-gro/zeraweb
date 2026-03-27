import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogPosts } from "@/lib/blog";

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-[56px]">
        <div className="mx-auto max-w-[1600px] px-[30px] pt-24 pb-24 lg:px-[60px] lg:pt-32 lg:pb-32 xl:px-[120px]">
          <p className="text-[13px] font-bold opacity-50 mb-4 uppercase">
            Blog
          </p>
          <h1 className="text-[48px] lg:text-[72px] font-bold leading-[0.92] uppercase mb-16">
            Novedades
          </h1>

          {blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  {/* Cover image */}
                  <div className="aspect-[16/10] bg-black/5 rounded-2xl mb-4 overflow-hidden">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-black/10 text-[48px] font-bold">
                          Z
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[12px] text-black/40">
                      {new Date(post.date).toLocaleDateString("es-AR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-black/20">&middot;</span>
                    <span className="text-[12px] text-black/40">
                      {post.author}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-[20px] font-semibold leading-tight mb-2 group-hover:text-black/70 transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-[14px] text-black/55 leading-[1.6] line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full bg-black/5 text-black/50 text-[11px] font-medium capitalize"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-[18px] text-black/40">
                Proximamente, publicaremos nuestras primeras entradas.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
