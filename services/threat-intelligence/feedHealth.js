const createFeedResult = ({ feed, status, records = 0, retrievedAt = new Date().toISOString(), error = null }) => ({
  feedId: feed.id,
  sourceId: feed.sourceId,
  status,
  records,
  retrievedAt,
  error: error ? String(error) : null,
});

const summarizeFeedHealth = (results) => {
  const total = results.length;
  const healthy = results.filter((item) => item.status === "healthy").length;
  const degraded = results.filter((item) => item.status === "degraded").length;
  const failed = results.filter((item) => item.status === "failed").length;

  return {
    total,
    healthy,
    degraded,
    failed,
    healthPercent: total ? Math.round((healthy / total) * 100) : 0,
  };
};

module.exports = { createFeedResult, summarizeFeedHealth };
