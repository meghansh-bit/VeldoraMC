import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-veldora-plugin-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
const encoder = new TextEncoder();
async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function hmac(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ success: false, error: "POST required." }, 405);
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const pluginSecret = Deno.env.get("VELDORA_PLUGIN_SECRET");
  const sessionSecret = Deno.env.get("VELDORA_SESSION_SECRET");
  if (!url || !serviceKey || !pluginSecret || !sessionSecret) return json({ success: false, error: "Linking service is not configured." }, 503);
  const db = createClient(url, serviceKey, { auth: { persistSession: false } });
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ success: false, error: "Invalid JSON." }, 400); }
  const action = body.action;

  // Only the trusted Paper plugin may register a code and player identity.
  if (action === "register") {
    if (req.headers.get("x-veldora-plugin-secret") !== pluginSecret) return json({ success: false, error: "Unauthorized plugin." }, 401);
    const uuid = String(body.minecraft_uuid ?? "").replace(/-/g, "").toLowerCase();
    const username = String(body.minecraft_username ?? "");
    const code = String(body.code ?? "");
    if (!/^[a-f0-9]{32}$/.test(uuid) || !/^[A-Za-z0-9_]{1,16}$/.test(username) || !/^\d{6}$/.test(code)) return json({ success: false, error: "Invalid player or code." }, 400);
    const codeHash = await sha256(code);
    const { error } = await db.from("minecraft_link_codes").insert({
      code_hash: codeHash, minecraft_uuid: uuid, minecraft_username: username,
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    });
    if (error) return json({ success: false, error: "Could not register link code." }, 409);
    return json({ success: true, expires_in: 300 });
  }

  if (action !== "claim") return json({ success: false, error: "Unknown action." }, 400);
  const code = String(body.code ?? "");
  if (!/^\d{6}$/.test(code)) return json({ success: false, error: "Enter the six-digit code shown in-game." }, 400);
  const codeHash = await sha256(code);
  const { data: record, error: readError } = await db.from("minecraft_link_codes")
    .select("code_hash,minecraft_uuid,minecraft_username,expires_at").eq("code_hash", codeHash).maybeSingle();
  if (readError || !record || new Date(record.expires_at).getTime() <= Date.now()) {
    if (record) await db.from("minecraft_link_codes").delete().eq("code_hash", codeHash);
    return json({ success: false, error: "Invalid or expired code. Run /link in-game to get a new one." }, 400);
  }
  // Consume first. A code can only be claimed once; delete must succeed before issuing a session.
  const { data: consumed, error: consumeError } = await db.from("minecraft_link_codes")
    .delete().eq("code_hash", codeHash).gt("expires_at", new Date().toISOString()).select("minecraft_uuid,minecraft_username").maybeSingle();
  if (consumeError || !consumed) return json({ success: false, error: "This code was already used or expired. Run /link again." }, 409);

  const player = { uuid: consumed.minecraft_uuid, username: consumed.minecraft_username };
  const { error: upsertError } = await db.from("minecraft_accounts").upsert({
    minecraft_uuid: player.uuid, minecraft_username: player.username, linked_at: new Date().toISOString(), last_seen_at: new Date().toISOString()
  }, { onConflict: "minecraft_uuid" });
  if (upsertError) return json({ success: false, error: "Could not save linked account." }, 500);
  const now = Math.floor(Date.now() / 1000);
  const payload = btoa(JSON.stringify({ sub: player.uuid, username: player.username, iat: now, exp: now + 60 * 60 * 24 * 7 })).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const token = payload + "." + await hmac(payload, sessionSecret);
  return json({ success: true, player, session_token: token, expires_in: 604800 });
});