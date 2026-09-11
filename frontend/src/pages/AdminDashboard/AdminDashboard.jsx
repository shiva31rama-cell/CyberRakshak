import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getStoredUser, isAuthenticated } from "../../services/authService";
import {
  deleteAdminFeedback,
  getAdminFeedback,
  getAdminScamReports,
  getAdminScamStatistics,
  updateAdminFeedbackStatus,
  updateAdminScamReportStatus,
} from "../../services/adminService";
import "./AdminDashboard.css";

const REPORT_STATUSES = ["new", "investigating", "resolved", "closed"];
const FEEDBACK_STATUSES = ["new", "reviewed", "resolved"];

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getStoredUser());
  const [reports, setReports] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [reportFilter, setReportFilter] = useState("all");
  const [reportSearch, setReportSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const [reportData, statsData, feedbackData] = await Promise.all([
        getAdminScamReports(),
        getAdminScamStatistics(),
        getAdminFeedback(),
      ]);
      setReports(reportData);
      setStatistics(statsData);
      setFeedback(feedbackData);
    } catch (err) {
      setError(err.message || "Unable to load the admin dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const verifyAdmin = async () => {
      if (!isAuthenticated()) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const data = await getCurrentUser();
        const currentUser = data.user;
        setUser(currentUser);
        if (currentUser?.role !== "admin") {
          navigate("/", { replace: true });
          return;
        }
        await loadDashboard();
      } catch {
        navigate("/login", { replace: true });
      }
    };

    verifyAdmin();
  }, [navigate, loadDashboard]);

  const filteredReports = useMemo(() => {
    const query = reportSearch.trim().toLowerCase();
    return reports.filter((report) => {
      const matchesStatus = reportFilter === "all" || report.status === reportFilter;
      const haystack = [
        report.caseNumber,
        report.reporterName,
        report.reporterEmail,
        report.scamType,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesStatus && (!query || haystack.includes(query));
    });
  }, [reports, reportFilter, reportSearch]);

  const reportStatusCounts = useMemo(() => {
    return reports.reduce(
      (counts, report) => {
        counts[report.status] = (counts[report.status] || 0) + 1;
        return counts;
      },
      { new: 0, investigating: 0, resolved: 0, closed: 0 },
    );
  }, [reports]);

  const handleReportStatus = async (reportId, status) => {
    try {
      const updated = await updateAdminScamReportStatus(reportId, status);
      setReports((items) => items.map((item) => (item._id === reportId ? { ...item, ...updated } : item)));
      const freshStats = await getAdminScamStatistics();
      setStatistics(freshStats);
    } catch (err) {
      setError(err.message || "Unable to update report status.");
    }
  };

  const handleFeedbackStatus = async (feedbackId, status) => {
    try {
      const updated = await updateAdminFeedbackStatus(feedbackId, status);
      setFeedback((items) => items.map((item) => (item._id === feedbackId ? { ...item, ...updated } : item)));
    } catch (err) {
      setError(err.message || "Unable to update feedback status.");
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm("Delete this feedback permanently?")) return;
    try {
      await deleteAdminFeedback(feedbackId);
      setFeedback((items) => items.filter((item) => item._id !== feedbackId));
    } catch (err) {
      setError(err.message || "Unable to delete feedback.");
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <section className="admin-page">
      <div className="admin-header">
        <div>
          <p className="admin-eyebrow">CyberRakshak Administration</p>
          <h1>Security Operations Center</h1>
          <p>Review live scam reports, update case status, monitor impact and manage user feedback.</p>
        </div>
        <button className="admin-refresh" onClick={() => loadDashboard(true)} disabled={refreshing}>
          {refreshing ? "Refreshing…" : "↻ Refresh data"}
        </button>
      </div>

      {error && <div className="admin-alert" role="alert">{error}</div>}

      <div className="admin-stat-grid">
        <article className="admin-stat-card"><span>Total reports</span><strong>{statistics.totalReports ?? reports.length}</strong></article>
        <article className="admin-stat-card"><span>New</span><strong>{reportStatusCounts.new}</strong></article>
        <article className="admin-stat-card"><span>Investigating</span><strong>{reportStatusCounts.investigating}</strong></article>
        <article className="admin-stat-card"><span>Resolved</span><strong>{reportStatusCounts.resolved}</strong></article>
        <article className="admin-stat-card"><span>Reported loss</span><strong>{formatCurrency(statistics.totalAmountLost)}</strong></article>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>Scam reports</h2>
            <p>{filteredReports.length} report{filteredReports.length === 1 ? "" : "s"} shown</p>
          </div>
          <div className="admin-controls">
            <input
              value={reportSearch}
              onChange={(event) => setReportSearch(event.target.value)}
              placeholder="Search case, name, email…"
              aria-label="Search scam reports"
            />
            <select value={reportFilter} onChange={(event) => setReportFilter(event.target.value)} aria-label="Filter scam reports">
              <option value="all">All statuses</option>
              {REPORT_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
        </div>

        {loading ? <p className="admin-empty">Loading live data…</p> : filteredReports.length === 0 ? (
          <p className="admin-empty">No scam reports match the current filters.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Case</th><th>Reporter</th><th>Type</th><th>Loss</th><th>Reported</th><th>Status</th></tr></thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report._id}>
                    <td><strong>{report.caseNumber || report._id}</strong></td>
                    <td><div>{report.reporterName || "—"}</div><small>{report.reporterEmail || "—"}</small></td>
                    <td>{report.scamType || "—"}</td>
                    <td>{formatCurrency(report.amountLost)}</td>
                    <td>{formatDate(report.reportedAt || report.createdAt)}</td>
                    <td>
                      <select value={report.status} onChange={(event) => handleReportStatus(report._id, event.target.value)} aria-label={`Status for ${report.caseNumber}`}>
                        {REPORT_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="admin-two-column">
        <div className="admin-panel">
          <div className="admin-panel-heading"><div><h2>Scam-type analytics</h2><p>Live aggregation from MongoDB</p></div></div>
          <div className="admin-bars">
            {(statistics.reportsByType || []).map((item) => {
              const max = Math.max(...(statistics.reportsByType || []).map((entry) => entry.count || 0), 1);
              return <div className="admin-bar-row" key={item._id}><span>{item._id || "Other"}</span><div><i style={{ width: `${((item.count || 0) / max) * 100}%` }} /></div><strong>{item.count}</strong></div>;
            })}
            {(!statistics.reportsByType || statistics.reportsByType.length === 0) && <p className="admin-empty">Analytics will appear after reports are submitted.</p>}
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-heading"><div><h2>Recent feedback</h2><p>{feedback.length} total feedback item{feedback.length === 1 ? "" : "s"}</p></div></div>
          <div className="admin-feedback-list">
            {feedback.slice(0, 8).map((item) => (
              <article className="admin-feedback-item" key={item._id}>
                <div className="admin-feedback-top"><strong>{"★".repeat(Math.max(0, Number(item.rating) || 0))}</strong><span>{formatDate(item.createdAt || item.submittedAt)}</span></div>
                <p>{item.comments}</p>
                <div className="admin-feedback-actions">
                  <select value={item.status} onChange={(event) => handleFeedbackStatus(item._id, event.target.value)} aria-label="Feedback status">
                    {FEEDBACK_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                  <button onClick={() => handleDeleteFeedback(item._id)} className="admin-delete">Delete</button>
                </div>
              </article>
            ))}
            {feedback.length === 0 && <p className="admin-empty">No feedback has been submitted yet.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;
