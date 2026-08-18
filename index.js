const mineflayer = require('mineflayer');
const http = require('http');

// 1. CHOOSE YOUR SERVER SETTINGS
const botOptions = {
    host: 'htsecer971.mcsh.io',      // Replace with your server IP address
    port: 25565,                      // Replace with your port if different
    username: 'CloudAFKBot',          // The in-game username for your bot
    auth: 'offline',                  // CRACKED MODE (No Microsoft/Mojang purchase check)
    version: '1.21.1'              // Force version if auto-detect fails
};

let bot;

function createBotInstance() {
    console.log(`Connecting bot to ${botOptions.host}...`);
    bot = mineflayer.createBot(botOptions);

    // Anti-AFK Routine (Jumps every 30 seconds to bypass idle timeout)
    bot.on('spawn', () => {
        console.log(`${botOptions.username} successfully logged in! Starting Anti-AFK loop.`);
        
        // Optional: If your cracked server uses AuthMe, uncomment and edit the line below:
        // bot.chat('/register yourpassword yourpassword');
        // bot.chat('/login yourpassword');

        setInterval(() => {
            if (bot && bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 30000); 
    });

    // Handle Kicks & Disconnections (Auto-reconnects after 15 seconds)
    bot.on('end', (reason) => {
        console.log(`Bot disconnected: ${reason}. Reconnecting in 15 seconds...`);
        setTimeout(createBotInstance, 15000);
    });

    bot.on('error', (err) => console.log(`Encountered error: ${err.message}`));
}

createBotInstance();

// 2. KEEP-ALIVE WEB SERVER (Forces Render's Free Container to stay running)
http.createServer((req, res) => {
    res.write("Bot is alive and running!");
    res.end();
}).listen(process.env.PORT || 8080);
