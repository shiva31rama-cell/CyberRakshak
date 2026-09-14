const FEEDS = [
  {
    id: "cert-in-advisories",
    sourceId: "cert-in",
    name: "CERT-In advisories",
    type: "advisory_index",
    url: "https://www.cert-in.org.in/s2cMainServlet?pageid=PUBADVLIST",
    enabled: true,
    priority: 1,
    parser: "cert-in-advisories",
  },
  {
    id: "i4c-cybercrime",
    sourceId: "i4c",
    name: "I4C cyber-safety information",
    type: "official_portal",
    url: "https://i4c.mha.gov.in/",
    enabled: true,
    priority: 1,
    parser: "manual-curated",
  },
  {
    id: "ncrp-suspect-services",
    sourceId: "ncrp",
    name: "NCRP suspect/reporting services",
    type: "official_service",
    url: "https://www.cybercrime.gov.in/",
    enabled: true,
    priority: 1,
    parser: "manual-curated",
  },
  {
    id: "rbi-consumer-safety",
    sourceId: "rbi",
    name: "RBI consumer and payment safety information",
    type: "official_regulator",
    url: "https://www.rbi.org.in/",
    enabled: true,
    priority: 1,
    parser: "manual-curated",
  },
  {
    id: "npci-safety",
    sourceId: "npci",
    name: "NPCI payment safety information",
    type: "official_payment_network",
    url: "https://www.npci.org.in/",
    enabled: true,
    priority: 1,
    parser: "manual-curated",
  },
  {
    id: "sanchar-saathi",
    sourceId: "sanchar-saathi",
    name: "Sanchar Saathi telecom safety services",
    type: "official_service",
    url: "https://www.sancharsaathi.gov.in/",
    enabled: true,
    priority: 1,
    parser: "manual-curated",
  },
];

const getEnabledFeeds = () => FEEDS.filter((feed) => feed.enabled).sort((a, b) => a.priority - b.priority);
const getFeedById = (id) => FEEDS.find((feed) => feed.id === id) || null;

module.exports = { FEEDS, getEnabledFeeds, getFeedById };
