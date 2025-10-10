const axios = require('axios');

module.exports.config = {
  name: "brave",
  version: "9",
  role: 0,
  hasPrefix: false,
  credits: "Cliff", //api by kenlie
  description: "AI powered by brave",
  aliases: ["Ai"],
  cooldowns: 0,
};

module.exports.run = async function ({api, event, args}) {
  const symbols = ["⎔", "☰"];
  const randomIndex = Math.floor(Math.random() * symbols.length);
  const tae = symbols[randomIndex];
  const query = encodeURIComponent(args.join(" "));

if (!query) {
          const messageInfo = await new Promise(resolve => {
            api.sendMessage('Please provide a question first!', event.threadID, (err, info) => {
                resolve(info);
            });
        });

        setTimeout(() => {
            api.unsendMessage(messageInfo.messageID);
        }, 10000);

        return;
}

      const cliff = await new Promise(resolve => { api.sendMessage('🦁 | 𝙱𝚛𝚊𝚟𝚎 𝙰𝙸 𝚒𝚜 𝚝𝚑𝚒𝚗𝚔𝚒𝚗𝚐 𝚙𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝...', event.threadID, (err, info1) => {
      resolve(info1);
     }, event.messageID);
    });

  const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/brave?search=${query}`;

  try {
    const response = await axios.get(apiUrl);
    const ans = `[𝗕𝗥𝗔𝗩𝗘] 𝖠𝖨/𝖲𝖤𝖠𝖱𝖢𝖧\n━━━━━━━━━━━━━\n${response.data.response}\n━━━━━━━━━━━━━`;
    api.editMessage(ans, cliff.messageID);
  } catch (error) {
    console.error();
    api.sendMessage("API SUCKS", event.threadID, event.messageID);
  }
};
