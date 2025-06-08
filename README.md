# 🐾 Meimei — The Cat Discord Bot

Meimei is a multi-purpose Discord bot with a cat persona 😼. She moderates your server and brings some fun interactions! Built using `discord.js`, Meimei supports moderation commands, weather reports, air quality info, and definitions from Urban Dictionary.

---

## 🛠️ Features

- 🛡️ **Moderation**
  - `$kick @user` — Kicks a user
  - `$ban @user` — Bans a user
  - `$unban <user_id>` — Unbans a user using their ID
  - `$mute @user [duration]` — Mutes a user (e.g., `1d`, `2h`, `30m`)
  - `$unmute @user` — Unmutes a user

- 🌦️ **Weather & Air Quality**
  - `$w <city>` — Displays current weather and AQI for the given city using OpenWeatherMap API

- 📚 **Dictionary**
  - `$df <word>` — Fetches formal/informal definitions from Urban Dictionary with pagination

- 🐱 **Fun Commands**
  - Replies with random cat GIFs or catchphrases when users say "meow" or "miau"

---

1. Clone the project
git clone https://github.com/dyeljack/Miau.git
cd miau-main

2. Install dependencies
npm install

3. Create a .env file
   In the root folder, create a file named .env and add:
   
   DISCORD_BOT_TOKEN=your_discord_bot_token
   WEATHER_KEY=your_openweathermap_api_key

▶️ Running the Bot
npm run start
or 
npm run dev (to run with nodemon)


