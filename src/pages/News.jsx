import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import PixelBox from "../components/ui/PixelBox";
import PixelButton from "../components/ui/PixelButton";
import { useSeo } from "../hooks/useSeo";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function News() {
  const [managedPosts, setManagedPosts] = useState([]);
  useEffect(() => { let alive = true; supabase.from("news_posts").select("slug,image,category,excerpt,title,created_at").eq("published", true).order("created_at", { ascending: false }).then(({ data }) => { if (alive && data) setManagedPosts(data.map(p => ({ ...p, date: new Date(p.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }), tone: "var(--color-info)", managed: true }))); }); return () => { alive = false; }; }, []);
  const posts = managedPosts;
  useSeo({
    title: "Announcements",
    description:
      "Season recaps, community events, and every announcement from the VeldoraMC Minecraft server.",
    path: "/news",
  });
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 s">
      <h1 className="title gold-gradient-text">Announcements</h1>
      <p className="p">
        Official VeldoraMC updates, events, maintenance notes, and community news.
      </p>

      {posts.length === 0 ? <div className="mt-8 rounded-xl border border-white/10 p-8 text-center"><h2 className="text-xl font-semibold">No announcements yet</h2><p className="mt-2 text-sm text-(--color-text-muted)">Check back soon for official VeldoraMC updates.</p></div> : <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map(
          ({ slug, image, category, tone, date, title, excerpt }) => (
            <PixelBox
              key={slug}
              tone="info"
              padding="none"
              className="overflow-hidden transition-transform hover:-translate-y-1"
            >
              <div className="h-44 w-full overflow-hidden bg-(--color-bg-soft)">
                <img
                  src={image}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-3 p-4">
                <div className="flex items-center gap-3">
                  <span
                    className="rounded-sm px-2 py-1 text-[9px] tracking-widest grident-text"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${tone} 18%, transparent)`,
                      color: tone,
                    }}
                  >
                    {category.toUpperCase()}
                  </span>
                  <span className="flex items-center gap-1 text-[10.5px] gradient-text">
                    <Calendar
                      size={12}
                      strokeWidth={2}
                      className="text-(--color-text)"
                    />
                    {date}
                  </span>
                </div>

                <h3 className="text-base font-semibold leading-snug gold-gradient-text">
                  {title}
                </h3>

                <p className="text-start text-sm leading-relaxed text-(--color-text-muted)">{excerpt}</p>

                <Link to={`/news/${slug}`} className="mt-auto">
                  <PixelButton tone="info" className="w-full py-5! gap-0!">
                    <span className="flex items-center justify-center gap-2 gradient-text">
                      Read More
                      <ArrowRight size={14} strokeWidth={2} color="#fff" />
                    </span>
                  </PixelButton>
                </Link>
              </div>
            </PixelBox>
          ),
        )}
      </div>}
    </section>
  );
}
