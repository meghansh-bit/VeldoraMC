package site.veldoramc.link;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.plugin.java.JavaPlugin;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

public final class VeldoraLink extends JavaPlugin {
    private HttpClient http;

    @Override public void onEnable() {
        saveDefaultConfig();
        http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();
        getLogger().info("VeldoraLink enabled. Configure endpoint and server-secret before use.");
    }

    @Override public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!(sender instanceof Player player)) {
            sender.sendMessage("Run this command in-game.");
            return true;
        }
        if (args.length != 1 || !args[0].matches("(?i)[A-F0-9]{10}")) {
            player.sendMessage("§bVeldoraMC §7» §fUse §b/link <code>§f from your website link page.");
            return true;
        }
        String endpoint = getConfig().getString("endpoint", "");
        String secret = getConfig().getString("server-secret", "");
        if (endpoint.contains("YOUR_PROJECT_REF") || secret.isBlank() || secret.equals("CHANGE-ME")) {
            player.sendMessage("§cAccount linking is not configured by the server yet.");
            return true;
        }
        String username = player.getName();
        UUID uuid = player.getUniqueId();
        player.sendMessage("§bVeldoraMC §7» §fChecking your one-time code…");
        CompletableFuture.runAsync(() -> {
            try {
                JsonObject body = new JsonObject();
                body.addProperty("action", "verify");
                body.addProperty("code", args[0].toUpperCase());
                body.addProperty("username", username);
                body.addProperty("uuid", uuid.toString());
                body.addProperty("edition", "java");
                HttpRequest request = HttpRequest.newBuilder(URI.create(endpoint))
                    .timeout(Duration.ofSeconds(10))
                    .header("Content-Type", "application/json")
                    .header("x-server-secret", secret)
                    .POST(HttpRequest.BodyPublishers.ofString(body.toString())).build();
                HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
                JsonObject result = JsonParser.parseString(response.body()).getAsJsonObject();
                getServer().getScheduler().runTask(this, () -> {
                    if (response.statusCode() >= 200 && response.statusCode() < 300 && result.has("ok") && result.get("ok").getAsBoolean()) {
                        player.sendMessage("§aVeldoraMC §7» §fMinecraft account §b" + username + " §fis linked!");
                    } else {
                        player.sendMessage("§cVeldoraMC §7» §f" + (result.has("error") ? result.get("error").getAsString() : "Code could not be verified."));
                    }
                });
            } catch (Exception ex) {
                getLogger().warning("Link verification failed: " + ex.getMessage());
                getServer().getScheduler().runTask(this, () -> player.sendMessage("§cVeldoraMC §7» §fLink service unavailable. Try again later."));
            }
        });
        return true;
    }
}
