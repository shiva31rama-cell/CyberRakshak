import { useMemo, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import { VIDEOS, VIDEO_CATEGORIES } from "../../../../shared/content/videos.mjs";
import Icon from "../../components/Icon/Icon";
import "./Videos.css";

const SAFE_ID = /^[A-Za-z0-9_-]{11}$/;

export function VideoCard({ video }) {
  const { t, pick } = useLanguage();
  const [playing, setPlaying] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);
  if (!SAFE_ID.test(video.id)) return null;
  const watchUrl = `https://www.youtube.com/watch?v=${video.id}`;
  return (
    <article className="card video-card">
      <div className="video-media">
        {playing ? (
          <iframe src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0`} title={video.title} loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
        ) : (
          <button type="button" className="video-thumb" onClick={() => setPlaying(true)} aria-label={`${t("vid.play")}: ${video.title}`}>
            {!thumbFailed ? <img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" loading="lazy" onError={() => setThumbFailed(true)} /> : <span className="video-fallback"><Icon name="play" size={28} /></span>}
            <span className="video-play"><Icon name="play" size={22} /></span>
          </button>
        )}
      </div>
      <div className="video-body">
        <div className="video-tags">
          <span className="badge">{t(`vcat.${video.category}`)}</span>
          <span className="badge">{video.lang === "te" ? "తెలుగు" : "English"}</span>
          {video.official && <span className="badge badge-official"><Icon name="check" size={12} /> {t("vid.official")}</span>}
        </div>
        <h3>{video.title}</h3>
        <p className="small muted">{pick(video.desc)}</p>
        <p className="small video-channel">{video.channel}</p>
        <a className="btn btn-secondary" href={watchUrl} target="_blank" rel="noopener noreferrer">{t("vid.watch")} <Icon name="external" size={15} /></a>
      </div>
    </article>
  );
}

function Videos() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("all");
  const [cat, setCat] = useState("all");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VIDEOS.filter((v) => (lang === "all" || v.lang === lang) && (cat === "all" || v.category === cat) && (!q || `${v.title} ${v.channel} ${v.desc.en} ${v.desc.te}`.toLowerCase().includes(q)));
  }, [query, lang, cat]);

  return (
    <div className="container page">
      <div className="page-head">
        <span className="eyebrow"><Icon name="play" size={14} /> {t("nav.videos")}</span>
        <h1>{t("vid.title")}</h1>
        <p>{t("vid.desc")}</p>
      </div>
      <div className="toolbar">
        <div className="search"><Icon name="search" size={18} /><input className="input" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("vid.search")} aria-label={t("vid.search")} /></div>
        <select className="select video-select" value={lang} onChange={(e) => setLang(e.target.value)} aria-label={t("vid.lang")}>
          <option value="all">{t("vid.lang.all")}</option><option value="en">{t("vid.lang.en")}</option><option value="te">{t("vid.lang.te")}</option>
        </select>
        <select className="select video-select" value={cat} onChange={(e) => setCat(e.target.value)} aria-label={t("vid.cat")}>
          <option value="all">{t("vid.cat.all")}</option>
          {VIDEO_CATEGORIES.map((c) => <option key={c} value={c}>{t(`vcat.${c}`)}</option>)}
        </select>
        <button type="button" className={`chip ${lang === "te" ? "on" : ""}`} aria-pressed={lang === "te"} onClick={() => setLang(lang === "te" ? "all" : "te")}>{t("vid.telugu")}</button>
      </div>
      <div className="notice" style={{ marginBottom: 20 }}><Icon name="info" size={18} />{t("vid.note")} {t("vid.unavailable")}</div>
      {list.length === 0 ? <div className="empty">{t("vid.empty")}</div> : <div className="grid grid-3">{list.map((v) => <VideoCard key={v.id} video={v} />)}</div>}
    </div>
  );
}

export default Videos;
