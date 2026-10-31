"use client";

import { useEffect, useState } from "react";

export default function NetworkStatus({ compact = false }) {
  const [status, setStatus] = useState("checking");
  const [players, setPlayers] = useState(null);

  useEffect(() => {
    let active = true;
    let timer;
    const check = async () => {
      try {
        const response = await fetch("/api/server-status", { cache: "no-store" });
        if (!response.ok) throw new Error("Status unavailable");
        const data = await response.json();
        if (!active) return;
        setStatus(data.online ? "online" : "offline");
        setPlayers(data.online && Number.isFinite(data.playersOnline) ? data.playersOnline : null);
      } catch {
        if (active) {
          setStatus("offline");
          setPlayers(null);
        }
      }
    };
    check();
    timer = window.setInterval(check, 60000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  const label = status === "checking"
    ? "CHECKING NETWORK"
    : status === "online"
      ? compact ? players === null ? "ONLINE" : players + " PLAYERS ONLINE" : "NETWORK ONLINE"
      : "NETWORK OFFLINE";

  return (
    <span className={"vld-network-status " + (compact ? "is-compact " : "") + "is-" + status} title="Live Minecraft server status">
      <i aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
