import { Link } from "react-router-dom";
import { Calendar, ArrowRight, MessageCircle } from "lucide-react";
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

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><PixelBox tone="info" padding="none" className="overflow-hidden"><div className="h-44 w-full overflow-hidden bg-(--color-bg-soft)"><img src="https://image.pollinations.ai/prompt/epic%20Minecraft-inspired%20fantasy%20red%20castle%20server%20launch%20poster%2C%20voxel%20landscape%2C%20cinematic%20sunset%2C%20no%20text?width=960&height=540&seed=4127&nologo=true" alt="VeldoraMC server launch artwork" className="h-full w-full object-cover"/></div><div className="flex flex-col gap-3 p-4"><span className="rounded-sm px-2 py-1 text-[9px] tracking-widest gradient-text">SERVER LAUNCH</span><h3 className="text-base font-semibold leading-snug">VeldoraMC launches in just a few days!</h3><p className="text-sm leading-relaxed text-(--color-text-muted)">The wait is almost over. Get your squad ready, explore Lifesteal, and join our Discord for the official launch date and more information.</p><a href="https://discord.gg/NruxFSnrUe" target="_blank" rel="noreferrer" className="mt-auto"><PixelButton tone="info" className="w-full py-5! gap-2!"><span className="flex items-center justify-center gap-2 gradient-text"><MessageCircle size={14}/> Join Discord for info <ArrowRight size={14}/></span></PixelButton></a></div></PixelBox>
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
      </div>
    </section>
  );
}
