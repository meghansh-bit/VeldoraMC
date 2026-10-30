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
    const lookup = await fetch(
      `https://api.minecraftservices.com/minecraft/profile/lookup/name/${encodeURIComponent(username)}`,
      { headers: { Accept: "application/json" } }
    );
    if (lookup.status === 404 || lookup.status === 204) {
      return res.status(404).json({ error: "We couldn't find that Java Edition username." });
    }
    if (!lookup.ok) {
      return res.status(lookup.status === 429 ? 429 : 502).json({ error: "Minecraft profile lookup is temporarily unavailable. Please try again." });
    }

    const profile = await lookup.json();
    if (!profile?.id || !profile?.name) {
      return res.status(404).json({ error: "No Java profile was found for that username." });
    }

    // Resolve the official Mojang texture property so we can distinguish a real
    // custom skin from a default Steve/Alex fallback.
    const session = await fetch(
      `https://sessionserver.mojang.com/session/minecraft/profile/${profile.id}?unsigned=false`,
      { headers: { Accept: "application/json" } }
    );
    let hasCustomSkin = false;
    if (session.ok) {
      const sessionProfile = await session.json();
      const textureProperty = sessionProfile?.properties?.find((item) => item.name === "textures");
      if (textureProperty?.value) {
        try {
          const decoded = JSON.parse(Buffer.from(textureProperty.value, "base64").toString("utf8"));
          hasCustomSkin = Boolean(decoded?.textures?.SKIN?.url);
        } catch {
          hasCustomSkin = false;
        }
      }
    }

    return res.status(200).json({
      id: profile.id,
      name: profile.name,
      hasCustomSkin,
      avatar: `https://mc-heads.net/avatar/${profile.id}/96`,
      body: `https://mc-heads.net/body/${profile.id}`
    });
  } catch {
    return res.status(502).json({ error: "Couldn't reach Minecraft profile services. Please try again." });
  }
}
