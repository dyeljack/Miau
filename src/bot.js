require("dotenv").config();
const axios = require('axios');
const { Client, GatewayIntentBits, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

//INTENTS
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, 
  ],
});
client.on('ready', () => {
  console.log("succesfully logged in");
})

const PREFIX = "$";

let conversation = [];

client.on("messageCreate", async (message) => {
  const botMember = message.guild.members.me;
  const botPermissions = message.channel.permissionsFor(botMember);

  if (!botPermissions?.has(PermissionsBitField.Flags.SendMessages) ||
  (botMember.communicationDisabledUntilTimestamp && botMember.communicationDisabledUntilTimestamp > Date.now())) {
    return console.log("Bot cannot send messages in this channel or is currently disabled.");
  }


    // ignore own messages
    if (message.author.bot) {
      return;

    }
    //kick,ban,mute, etc.
    if (message.content.startsWith(PREFIX)) {
      const [CMD_NAME, ...args] = message.content.trim().substring(PREFIX.length).split(/\s+/);
      //kick
      if (CMD_NAME === "kick") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
          return message.reply("you do not have permissions to use that command");
        }
        if (args.length === 0) return message.reply("kick what?");
        const member = message.mentions.members.first();
        if (member.id === message.author.id) return message.reply("you tagged yourself ");
        if (member) {
          member
            .kick()
            .then((member) => {
              message.channel.send(`${member} has been kicked 🦵💥`)
              message.channel.send("https://tenor.com/view/ripbozo-rip-bozo-rest-in-piss-packwatch-james-worthy-gif-6906351621115625331")
            })
            .catch((err) => message.channel.send("⚠️unable to kick that user"));

        }
        else { message.reply("Member not found"); }
      }
      //ban 
      if (CMD_NAME === "ban") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
          return message.reply("you do not have permissions to use that command");
        }
        if (args.length === 0) return message.reply("Ban what?");
        try {
          const member = message.mentions.members.first();
          if (member === message.author.id) return message.reply("you tagged yourself ");
          await member.ban();
          message.channel.send(`${member} was banned`);
          message.channel.send("https://tenor.com/view/ripbozo-rip-bozo-rest-in-piss-packwatch-james-worthy-gif-6906351621115625331");
        } catch (err) {
          message.channel.send("unable to ban that user, Either i dont have permissions or that user is not found");
        }
      }
      //unban
      if (CMD_NAME === "unban") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
          return message.reply("you do not have permissions to use that command");
        }
        if (args.length === 0) return message.reply("Unban what?");
        message.guild.bans.remove(args[0]).then(user => {
          message.channel.send(`\`${user.username}\` was unbanned`);
          message.channel.send("https://tenor.com/view/gantz-white-boy-healing-gif-13275253462938996312");
        })
          .catch((err) => message.channel.send("couldn't unmute idk why tbh 😹"));
      }
      //mute
      if (CMD_NAME === "mute") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
          return message.reply("you do not have permissions to use that command");
        }
        if (!args[1]) args[1] = '1m';
        const member = message.mentions.members.first();
        if (member.id === message.author.id) return message.reply("you tagged yourself ");
        const timeUnits = {
          d: 86400000, // days
          h: 3600000, // hours
          m: 60000, // minutes
        };
        let durationMS = 0;
        const regex = /(\d+)([dhm])/g;
        let match;
        while ((match = regex.exec(args[1])) !== null) {
          const [, value, unit] = match;
          durationMS += parseInt(value) * timeUnits[unit];
        }

        member.disableCommunicationUntil(Date.now() + durationMS)
          .then(() => {
            message.channel.send(`${member} has been muted for ${args[1]}\n🤸\n🦽🏌️‍♂️`);
          })
          .catch((err) => message.channel.send("enable to mute, its their lucky day."));
      }
      //unmute
      if (CMD_NAME === "unmute") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
          return message.reply("you do not have permissions to use that command");
        }
        if (args.length === 0) return message.reply("unmute what?");
        const member = message.mentions.members.first();
        if (member.id === message.author.id) return message.reply("you tagged yourself ");
        member.disableCommunicationUntil(null)
          .then(() => {
            message.channel.send(`unmuted ${member}`);
          })
          .catch((err) => message.channel.send("enable to unmute, deal with it 😹"));
      }
      //avatar view
      if (CMD_NAME === "av") {
        const member = message.mentions.members.first() || message.member;
        message.reply(member.user.displayAvatarURL({ dynamic: true, size: 1024 }));
      }
      //weather
      if (CMD_NAME === "w") {
        try {
          const city = args[0];
          if (!city) return message.channel.send("please enter a city!");
          const geourl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.WEATHER_KEY}`;
          const geoResponse = await axios.get(geourl);
          if (!geoResponse.data.length) {
            return message.channel.send("City not found.");
          }
          const lat = geoResponse.data[0].lat;
          const lon = geoResponse.data[0].lon;

          const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_KEY}&units=metric`;
          const airQualityurl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_KEY}`
          const airQualityResponse = await axios.get(airQualityurl);
          const aqi = airQualityResponse.data.list[0].main.aqi; // Air Quality Index
          let airQuality;
          if (aqi <= 1) airQuality = "Good";
          else if (aqi <= 2) airQuality = "Fair";
          else if (aqi <= 3) airQuality = "Moderate";
          else if (aqi <= 4) airQuality = "Poor";
          else airQuality = "Very Poor";
          axios.get(url).then(responce => {
            const data = responce.data;
            const isNight = data.weather[0].icon.includes('n'); // e.g., "01n"
            const embed = new EmbedBuilder()
              .setColor(isNight ? '#0d1b2a' : '#00aaff')
              .setTitle(`${isNight ? '🌙' : '🌤️'} Weather in ${city}`)
              .addFields(
                { name: 'Description', value: `\`${data.weather[0].description}\``, inline: true },
                { name: 'Temperature', value: `\`${data.main.temp}°C\``, inline: true },
                { name: 'Humidity', value: `\`${data.main.humidity}%\``, inline: true },
                { name: 'Wind Speed', value: `\`${data.wind.speed} m/s\``, inline: true },
                { name: 'Temp Range', value: `\`${data.main.temp_min}°C / ${data.main.temp_max}°C\``, inline: true },
                { name: 'Air Quality', value: `\`${airQuality}\``, inline: true } // Optional
              )
              .setThumbnail('https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png') // weather icon
              .setTimestamp();
            message.channel.send({ embeds: [embed] });
          }).catch((err) => {
            message.channel.send("Unable to fetch weather data, please check the city name and try again.");
            console.log(console.err);
          });
        } catch (err) {
          console.error(err);
          message.channel.send("An error occurred while fetching the weather data.");
        }
      }
      // dictionary
      if (CMD_NAME === "df") {
        const term = args.join(" ");
        const url = `https://unofficialurbandictionaryapi.com/api/search?term=${term}&limit=10&`;

        axios.get(url).then(async (response) => {
          const data = response.data.data;
          if (!data || data.length === 0) {
            return message.channel.send('No definitions found.');
          }

          let currentPage = 0;

          const getEmbed = (page) => {
            const entry = data[page];
            return new EmbedBuilder()
              .setTitle(`${entry.word}`)
              .setDescription(`**Definition:** ${entry.meaning}`)
              .addFields(
                { name: 'Example:', value: entry.example || 'N/A' },
                { name: 'Author:', value: entry.contributor || 'Unknown', inline: true }
              )
              .setFooter({ text: `Page ${page + 1} of ${data.length}` })
              .setColor(0x1d82b6);
          };

          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('prev')
              .setStyle(ButtonStyle.Primary)
              .setEmoji('◀️'),
            new ButtonBuilder()
              .setCustomId('next')
              .setStyle(ButtonStyle.Primary)
              .setEmoji('▶️')
          );

          const botMessage = await message.channel.send({
            embeds: [getEmbed(currentPage)],
            components: [row],
            fetchReply: true
          });

          const collector = botMessage.createMessageComponentCollector({ time: 120000 });

          collector.on('collect', async (i) => {


            if (i.customId === 'prev' && currentPage > 0) {
              currentPage = currentPage - 1;
            } else if (i.customId === 'next' && currentPage < data.length - 1) {
              currentPage = currentPage + 1;
            }

            await i.update({
              embeds: [getEmbed(currentPage)],
              components: [row]
            });
          });
          collector.on('end', async () => {
            try {
              await botMessage.edit({ components: [] }); // remove buttons
            } catch (error) {
              console.error("Failed to remove buttons:", error);
            }
          });
        }).catch((err) => {
          console.error(err);
          message.channel.send("Unable to fetch definitions for this word.");
        });

      }
    }

    const meowTriggers = ["Meow", "Miau", "MIAUU", "meow meow", "https://tenor.com/view/attack-tole-tole-humble-cat-evil-nefarious-gif-3184810906682277049", "https://tenor.com/view/tole-cat-cute-gif-12080171459357821404", "https://tenor.com/view/vro-vro-tole-tole-tole-tole-tole-tole-cat-gif-2308242063764553127",
      "https://tenor.com/view/cat-meme-cat-cute-stare-cat-cat-stare-gif-123175587496084398", "https://tenor.com/view/tole-tole-tole-mei-mei-cat-silly-cat-gif-18075929288882159057", "https://tenor.com/view/tole-tole-mei-mei-vro-dumbbell-training-gif-10134648312336833177", "https://tenor.com/view/tole-tole-tole-tole-cat-meimei-mei-mei-pineapple-hat-gif-8034133085723891351", "https://tenor.com/view/tole-tole-mei-mei-vro-cat-sit-ups-gif-1263870559505718490",
      "https://tenor.com/view/tole-tole-tole-tole-cat-meimei-mei-mei-mermaid-gif-13288647365028992019", "https://tenor.com/view/vro-vro-cat-cat-tole-tole-tole-tole-cat-gif-3583064468191565130", "https://tenor.com/view/neppico-gif-12490047082767817490",
      "https://tenor.com/view/tole-tole-mei-mei-tole-tole-cat-mei-mei-cat-tole-tole-mei-mei-gif-5406661688992311192", "https://tenor.com/view/sister-mei-cat-gif-10590036499419006188",
      "https://tenor.com/view/sister-mei-tole-tole-tole-tole-cat-sister-mei-cat-e-to-pick-up-item-gif-14003122538202570910", "https://tenor.com/view/tole-tole-tole-tole-cat-vro-cat-vro-mei-mei-gif-7992846861221768941",
      "https://tenor.com/view/tole-tole-tole-tole-cat-meimei-mei-mei-chinese-empress-gif-8392135566479741284", "https://tenor.com/view/meimei-mei-mei-mei-cat-meimei-cat-tole-tole-gif-9937841451382833309", "https://tenor.com/view/cat-triggered-gif-26561244", "https://tenor.com/view/vro-mei-cat-hello-vro-spin-gif-13097298350150128975", "https://tenor.com/view/tole-tole-vro-mei-mei-tole-lashes-gif-17009796655860543915", "https://tenor.com/view/pissed-off-cat-rage-angry-gun-gif-16864368"

    ];
    let miauTrigger = Math.floor(Math.random() * meowTriggers.length);
    //specific replies mapping
    const triggers = new Map([
      ["miau", meowTriggers[miauTrigger]],
      ["meow", meowTriggers[miauTrigger]],
    ]);
    // specific reply loop
    const lowercontent = message.content.toLowerCase();
    for (const [trigger, responce] of triggers) {
      if (lowercontent === trigger) {
        message.reply(responce);
        miauTrigger = Math.floor(Math.random() * meowTriggers.length);
        break;
      }
    }
});
client.login(process.env.DISCORD_BOT_TOKEN);

