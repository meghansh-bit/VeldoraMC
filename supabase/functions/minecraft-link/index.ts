import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": Deno.env.get("SITE_ORIGIN") || "https://veldoramc.vercel.app",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-server-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: cors });
const service = () => createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const sha256 = async (value: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST required" }, 405);
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
  const db = service();

  if (body.action === "generate") {
    const auth = req.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) return json({ error: "Sign in first" }, 401);
    const token = auth.slice(7);
    const { data: { user }, error: authError } = await db.auth.getUser(token);
    if (authError || !user) return json({ error: "Invalid website session" }, 401);

    const rawCode = crypto.randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase();
    const codeHash = await sha256(rawCode);
    const now = new Date();
    const { error: cleanupError } = await db.from("minecraft_link_codes")
      .delete().eq("user_id", user.id).is("used_at", null);
    if (cleanupError) return json({ error: "Could not prepare a new code" }, 500);
    const { error: insertError } = await db.from("minecraft_link_codes").insert({
      user_id: user.id, code_hash: codeHash,
      expires_at: new Date(now.getTime() + 5 * 60 * 1000).toISOString(),
    });
    if (insertError) return json({ error: "Could not create link code" }, 500);
    return json({ code: rawCode, expiresInSeconds: 300, command: "/link " + rawCode });
  }

  if (body.action === "verify") {
    const expected = Deno.env.get("MINECRAFT_LINK_SERVER_SECRET");
    const supplied = req.headers.get("x-server-secret");
    if (!expected || !supplied || supplied !== expected) {
      return json({ error: "Unauthorized server" }, 401);
    }
    const code = String(body.code || "").trim().toUpperCase();
    const username = String(body.username || "").trim();
    const uuid = String(body.uuid || "").trim().replaceAll("-", "").toLowerCase();
    const edition = body.edition === "bedrock" ? "bedrock" : "java";
    if (!/^[A-F0-9]{10}$/.test(code) || !/^[A-Za-z0-9_]{3,16}$/.test(username) ||
      !/^[a-f0-9]{32}$/.test(uuid)) return json({ error: "Invalid link request" }, 400);

    const { data: linkCode, error: findError } = await db.from("minecraft_link_codes")
      .select("id,user_id,expires_at,used_at").eq("code_hash", await sha256(code)).maybeSingle();
    if (findError || !linkCode || linkCode.used_at || new Date(linkCode.expires_at).getTime() < Date.now()) {
      return json({ error: "Code is invalid, expired, or already used" }, 400);
    }
    // A single-use conditional update prevents two simultaneous server requests
    // from redeeming the same code.
    const { data: claimed, error: claimError } = await db.from("minecraft_link_codes")
      .update({ used_at: new Date().toISOString() })
      .eq("id", linkCode.id).is("used_at", null).gt("expires_at", new Date().toISOString())
      .select("id").maybeSingle();
    if (claimError || !claimed) return json({ error: "Code was already used or expired" }, 409);

    const { error: upsertError } = await db.from("minecraft_links").upsert({
      user_id: linkCode.user_id, minecraft_username: username,
      minecraft_uuid: uuid, edition, updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    if (upsertError) {
      // Do not leave the code usable after an identity conflict.
      return json({ error: "That Minecraft identity is already linked to another website account" }, 409);
    }
    return json({ ok: true, username, edition });
  }

  if (body.action === "status") {
    const auth = req.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) return json({ error: "Sign in first" }, 401);
    const { data: { user }, error } = await db.auth.getUser(auth.slice(7));
    if (error || !user) return json({ error: "Invalid website session" }, 401);
    const { data, error: queryError } = await db.from("minecraft_links")
      .select("minecraft_username,minecraft_uuid,edition,linked_at").eq("user_id", user.id).maybeSingle();
    if (queryError) return json({ error: "Could not load linked account" }, 500);
    return json({ linked: data || null });
  }
  return json({ error: "Unknown action" }, 400);
});
