const mineflayer = require('mineflayer')

// --- CONFIGURATION ---
const BOT_CONFIG = {
  host: 'htsecer971.mcsh.io',     // Replace with your MCServerHost server IP
  port: 25565,                      // Replace with your custom port if you have one
  username: 'PregenCloudBot',      // The cracked username for your bot
  version: '1.26.2'                // Replace with your exact Fabric server version
}
// ---------------------

let bot;

function createMyBot() {
  console.log(`[Bot] Connecting to ${BOT_CONFIG.host}:${BOT_CONFIG.port} as ${BOT_CONFIG.username}...`)
  
  bot = mineflayer.createBot(BOT_CONFIG)

  // Anti-AFK Routine: Makes the bot jump every 45 seconds to bypass automated kicks
  let afkInterval;
  bot.once('spawn', () => {
    console.log('[Bot] Successfully spawned in the world! Starting anti-AFK jump loop.')
    
    afkInterval = setInterval(() => {
      if (bot && bot.entity) {
        bot.setControlState('jump', true)
        setTimeout(() => {
          bot.setControlState('jump', false)
        }, 500) // Hold spacebar for half a second
      }
    }, 45000) // Triggers every 45,000 milliseconds (45 seconds)
  })

  // Log server messages to your cloud console so you can see Chunky progress
  bot.on('chat', (username, message) => {
    if (username === bot.username) return
    console.log(`[Chat] <${username}> ${message}`)
  })

  // Auto-Reconnect Routine if the server kicks the bot
  bot.on('kick', (reason) => {
    console.log(`[Bot] Kicked from server. Reason: ${reason}`)
    clearInterval(afkInterval)
  })

  // Auto-Reconnect Routine if the server crashes or closes
  bot.on('end', () => {
    console.log('[Bot] Connection lost. Attempting to reconnect in 15 seconds...')
    clearInterval(afkInterval)
    setTimeout(createMyBot, 15000) // Wait 15 seconds before trying again
  })

  // Error catching to prevent the cloud container from crashing entirely
  bot.on('error', (err) => {
    console.log(`[Error] ${err.message}`)
  })
}

// Start the bot loop
createMyBot()
