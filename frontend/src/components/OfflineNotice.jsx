import { useEffect, useState } from "react";
import "./OfflineNotice.css";

function OfflineNotice() {
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (online) return null;
  return (
    <div className="offline-notice" role="status" aria-live="polite">
      <strong>You’re offline.</strong>
      <span>The cached app shell may still open; AI chat, message scanning, URL scanning and other server-backed actions need a connection.</span>
    </div>
  );
}

export default OfflineNotice;
