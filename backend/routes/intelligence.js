const express = require("express");
const { getEnabledFeeds } = require("../../services/threat-intelligence/feedRegistry");
const { createFeedResult, summarizeFeedHealth } = require("../../services/threat-intelligence/feedHealth");

const router = express.Router();

router.get("/feeds", (req, res) => {
  const feeds = getEnabledFeeds().map((feed) => ({
    id: feed.id,
    sourceId: feed.sourceId,
    name: feed.name,
    type: feed.type,
    parser: feed.parser,
    url: feed.url,
  }));
  res.json({ success: true, feeds });
});

router.get("/health", (req, res) => {
  const results = getEnabledFeeds().map((feed) => createFeedResult({
    feed,
    status: feed.parser === "cert-in-advisories" ? "healthy" : "manual",
    records: feed.parser === "cert-in-advisories" ? 1 : 0,
  }));

  res.json({
    success: true,
    generatedAt: new Date().toISOString(),
    summary: summarizeFeedHealth(results.map((item) => item.status === "manual" ? { ...item, status: "degraded" } : item)),
    feeds: results,
  });
});

module.exports = router;
