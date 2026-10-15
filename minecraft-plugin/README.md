# VeldoraLink Paper plugin

This plugin provides `/link` for the VeldoraMC Minecraft-only website identity flow.

## Build
Requires JDK 21 and Maven:
```sh
mvn package
```
Copy `target/veldora-link-1.0.0.jar` to the Paper server's `plugins` directory, then restart.

## Configure
1. Apply `supabase/migrations/20261015000000_minecraft_only_linking.sql` to the same Supabase project as the website.
2. Deploy `supabase/functions/minecraft-link`.
3. Set Edge Function secrets `VELDORA_PLUGIN_SECRET` and `VELDORA_SESSION_SECRET` to long random values; also set the standard Supabase secrets.
4. Edit `plugins/VeldoraLink/config.yml` with the Supabase project URL and the same plugin secret. Do not publish this secret or commit the live value.
5. The site needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` set in Vercel.

## Important
The web function issues a signed short-lived session token after a one-time code claim. The frontend stores it locally for UI identity only; any privileged API must independently validate the signature and authorization. Never grant admin access based on a Minecraft link token. Supabase admin access remains restricted to the existing admin role check.

The six-digit code has only 1,000,000 possibilities. Production must add rate limiting at the edge/WAF and a short retry cooldown before public launch. Use a reverse proxy/rate-limit policy on the function endpoint, and monitor failed claims.