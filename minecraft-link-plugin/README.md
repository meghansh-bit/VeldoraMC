# VeldoraLink plugin

Paper 1.21.x plugin for redeeming one-time website link codes with `/link CODE`.

## Build
Requires JDK 21 and Maven:
```sh
mvn package
```
The plugin jar is created in `target/`. Install it in the server's `plugins` directory and restart.

## Configure
1. Deploy the `supabase/functions/minecraft-link` Edge Function.
2. Set Edge Function secrets `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `MINECRAFT_LINK_SERVER_SECRET`, and optionally `SITE_ORIGIN` in Supabase. Use a long random secret for the server secret.
3. Run `supabase/migrations/20261011000000_minecraft_linking.sql` in the Supabase SQL Editor.
4. Edit the plugin's generated `plugins/VeldoraLink/config.yml` on the server with the real Edge Function URL and same server secret. Never commit the real secret.
5. Deploy the website and try linking while the server is online.

## Important
This first version supports Java players on Paper, including offline-mode/cracked servers. Offline-mode usernames and UUIDs are not cryptographic proof of permanent ownership; the link only proves that the player connected under that name redeemed the code at that moment. Keep server access controls and staff policies in mind. Bedrock/Floodgate support is not implemented in this version.
