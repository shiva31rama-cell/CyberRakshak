import "./VideoEmbed.css";

function VideoEmbed({ videoId, title, description }) {
  if (!videoId) return null;

  return (
    <article className="video-card">
      <div className="video-frame">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <div className="video-copy">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
    </article>
  );
}

export default VideoEmbed;
