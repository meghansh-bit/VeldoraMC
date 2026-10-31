export const dynamic = "force-dynamic";

const SERVER_HOST = process.env.MINECRAFT_SERVER_HOST || "play.veldoramc.net";

export async function GET() {
  try {
    const response = await fetch(
      "https://api.mcsrvstat.us/3/" + encodeURIComponent(SERVER_HOST),
      { cache: "no-store", signal: AbortSignal.timeout(4500) }
    );
    if (!response.ok) throw new Error("Minecraft status provider unavailable");
    const data = await response.json();
    const online = data.online === true;
    return Response.json({
      online,
      host: SERVER_HOST,
      playersOnline: online && Number.isFinite(data.players?.online) ? data.players.online : null,
      maxPlayers: online && Number.isFinite(data.players?.max) ? data.players.max : null,
      version: online && typeof data.version === "string" ? data.version : null,
      checkedAt: new Date().toISOString(),
    }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch {
    return Response.json({
      online: false,
      host: SERVER_HOST,
      playersOnline: null,
      maxPlayers: null,
      version: null,
      checkedAt: new Date().toISOString(),
    }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  }
}
