import { Link } from "react-router-dom";
import { Calendar, ArrowRight, MessageCircle, Newspaper } from "lucide-react";
import PixelBox from "../components/ui/PixelBox";
import { newsPosts } from "../data/news";
import { useSeo } from "../hooks/useSeo";

export default function Home() {
  useSeo({
    title: "VeldoraMC — Latest News & Updates",
    description: "The latest VeldoraMC announcements, community updates, events, and server news.",
    path: "/",
  });

  const featured = newsPosts[0];
  const stories = newsPosts.slice(1, 4);

  return (
    <main className="home-news-page mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <section className="home-news-heading">
        <div className="home-news-kicker"><Newspaper size={14} /> THE VELDORAMC JOURNAL</div>
        <h1 className="title gold-gradient-text">Latest News</h1>
        <p className="p">Updates, events, announcements, and stories from around the VeldoraMC community.</p>
      </section>

      {featured && (
        <Link to={`/news/${featured.slug}`} className="home-featured-link">
          <article className="home-featured-story">
            <div className="home-featured-image">
              <img src={featured.image} alt={featured.title} />
              <span className="home-featured-label">{featured.category}</span>
            </div>
            <div className="home-featured-copy">
              <div className="home-story-meta"><span>{featured.category.toUpperCase()}</span><span><Calendar size={13} /> {featured.date}</span></div>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <span className="home-story-read">READ STORY <ArrowRight size={15} /></span>
            </div>
          </article>
        </Link>
      )}

      <section className="home-news-listing">
        <div className="home-news-listing-head">
          <div><span className="section-kicker">FROM THE COMMUNITY</span><h2>More stories<span>.</span></h2></div>
          <Link to="/news" className="home-view-all">ALL NEWS <ArrowRight size={15} /></Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map(({ slug, image, category, tone, date, title, excerpt }) => (
            <PixelBox key={slug} tone="info" padding="none" className="home-news-card overflow-hidden">
              <Link to={`/news/${slug}`} className="home-news-card-image">
                <img src={image} alt={title} loading="lazy" />
                <span className="home-news-category" style={{ "--story-tone": tone }}>{category.toUpperCase()}</span>
              </Link>
              <div className="flex flex-col gap-3 p-4">
                <span className="home-news-date"><Calendar size={12} /> {date}</span>
                <h3>{title}</h3>
                <p className="p text-start! text-[10px]!">{excerpt}</p>
                <Link to={`/news/${slug}`} className="home-news-read">READ MORE <ArrowRight size={14} /></Link>
              </div>
            </PixelBox>
          ))}
        </div>
      </section>

      <section className="home-news-community">
        <div>
          <span className="section-kicker">STAY IN THE LOOP</span>
          <h2>News is just the beginning<span>.</span></h2>
          <p>Join the community for announcements, event updates, and conversations with other players.</p>
        </div>
        <a href="https://discord.gg/NruxFSnrUe" target="_blank" rel="noreferrer" className="vbtn vbtn-primary"><MessageCircle size={17} /> JOIN DISCORD <ArrowRight size={15} /></a>
      </section>
    </main>
  );
}
