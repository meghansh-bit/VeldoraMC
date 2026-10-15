package site.veldoramc.link;

import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.plugin.java.JavaPlugin;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.concurrent.CompletableFuture;

public final class VeldoraLinkPlugin extends JavaPlugin {
    private final SecureRandom random = new SecureRandom();
    private HttpClient http;

    @Override public void onEnable() {
        saveDefaultConfig();
        http = HttpClient.newBuilder().build();
        if (getCommand("link") != null) getCommand("link").setExecutor(this::onLink);
    }

    private boolean onLink(CommandSender sender, Command command, String label, String[] args) {
        if (!(sender instanceof Player player)) {
            sender.sendMessage("This command can only be used in-game.");
            return true;
        }
        String base = getConfig().getString("supabase-url", "").replaceAll("/+$", "");
        String secret = getConfig().getString("plugin-secret", "");
        if (base.isBlank() || base.contains("YOUR_PROJECT") || secret.isBlank() || secret.equals("CHANGE_ME_TO_A_LONG_RANDOM_SECRET")) {
            player.sendMessage("§cVeldora linking is not configured yet. Please contact staff.");
            return true;
        }
        String code = String.format("%06d", random.nextInt(1_000_000));
        String payload = "{\"action\":\"register\",\"code\":\"" + code + "\",\"minecraft_uuid\":\"" +
                player.getUniqueId().toString().replace("-", "") + "\",\"minecraft_username\":\"" + player.getName() + "\"}";
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(base + "/functions/v1/minecraft-link"))
                .header("Content-Type", "application/json")
                .header("apikey", getConfig().getString("supabase-anon-key", ""))
                .header("x-veldora-plugin-secret", secret)
                .POST(HttpRequest.BodyPublishers.ofString(payload, StandardCharsets.UTF_8)).build();
        CompletableFuture.runAsync(() -> {
            try {
                HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
                if (response.statusCode() >= 200 && response.statusCode() < 300 && response.body().contains("\"success\":true")) {
                    player.sendMessage("§aYour VeldoraMC link code is: §f§l" + code);
                    player.sendMessage("§7Enter it at §bhttps://veldoramc.vercel.app/login");
                    player.sendMessage("§7This code expires in 5 minutes and can only be used once.");
                } else {
                    getLogger().warning("Link registration failed with HTTP " + response.statusCode());
                    player.sendMessage("§cCouldn't create a link code. Please try again shortly.");
                }
            } catch (Exception e) {
                getLogger().warning("Link registration request failed: " + e.getClass().getSimpleName());
                player.sendMessage("§cCouldn't reach the linking service. Please try again shortly.");
            }
        });
        player.sendMessage("§7Generating a secure linking code…");
        return true;
    }
}