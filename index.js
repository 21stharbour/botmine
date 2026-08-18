const mineflayer = require('mineflayer')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

// --- 1. THE WEB SERVER KEEPAWAKE LOOP ---
// This exposes a public web page so ping tools can wake Bonto up
app.get('/', (req, res) => {
  res.send('Pregen Cloud Bot is Online and Operating!')
})

app.listen(port, () => {
  console.log(`[Web] Keep-awake web server listening on port ${port}`)
})

// --- 2. THE MINECRAFT BOT CONFIGURATION ---
const BOT_CONFIG = {
  host: 'htsecer971.mcsh.io',     // Replace with your MCServerHost server IP
  port: 25565,                      // Replace with your custom port if you have one
  username: 'PregenCloudBot',      // The cracked username for your bot
  version: '1.26.2'                // Replace with your exact Fabric server version
}

let bot;

function createMyBot() {
  console.log(`[Bot] Connecting to ${BOT_CONFIG.host}:${BOT_CONFIG.port} as ${BOT_CONFIG.username}...`)
  
  bot = mineflayer.createBot(BOT_CONFIG)

  let afkInterval;
  bot.once('spawn', () => {
    console.log('[Bot] Successfully spawned in the world! Starting anti-AFK jump loop.')
    
    afkInterval = setInterval(() => {
      if (bot && bot.entity) {
        bot.setControlState('jump', true)
        setTimeout(() => {
          bot.setControlState('jump', false)
        }, 500)
      }
    }, 45000) // Jump every 45 seconds
  })

  bot.on('chat', (username, message) => {
    if (username === bot.username) return
    console.log(`[Chat] <${username}> ${message}`)
  })

  bot.on('kick', (reason) => {
    console.log(`[Bot] Kicked from server. Reason: ${reason}`)
    clearInterval(afkInterval)
  })

  bot.on('end', () => {
    console.log('[Bot] Connection lost. Reconnecting in 15 seconds...')
    clearInterval(afkInterval)
    setTimeout(createMyBot, 15000)
  })

  bot.on('error', (err) => {
    console.log(`[Error] ${err.message}`)
  })
}

createMyBot()
