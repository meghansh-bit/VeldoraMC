export default async function handler(req, res) {
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const username = String(req.query.username || "").trim();
  if (!/^[A-Za-z0-9_]{3,16}$/.test(username)) {
    return res.status(400).json({ error: "Enter a valid Java username (3–16 letters, numbers or underscores)." });
  }

  try {
    const upstream = await fetch(
      `https://api.minecraftservices.com/minecraft/profile/lookup/name/${encodeURIComponent(username)}`,
      { headers: { Accept: "application/json" } }
    );

    if (upstream.status === 404 || upstream.status === 204) {
      return res.status(404).json({ error: "We couldn't find that Java Edition username." });
    }
    if (!upstream.ok) {
      return res.status(upstream.status === 429 ? 429 : 502).json({ error: "Minecraft profile lookup is temporarily unavailable. Please try again." });
    }

    const profile = await upstream.json();
    if (!profile?.id || !profile?.name) {
      return res.status(404).json({ error: "No Java profile was found for that username." });
    }
    return res.status(200).json({ id: profile.id, name: profile.name });
  } catch {
    return res.status(502).json({ error: "Couldn't reach Minecraft profile services. Please try again." });
  }
}
