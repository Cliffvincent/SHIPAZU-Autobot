const a = require('axios');

let dp = {};

dp["config"] = {
  name: "deepseek",
  version: "9",
  role: 0,
  hasPrefix: false,
  credits: "Cliff",
  description: "AI powered by Deepseek China",
  aliases: ["ds", "deep"],
  cooldowns: 0,
};

dp["run"] = async function ({ api: b, event: c, args: d }) {
  const e = ["🐳", "🐋"];
  const f = Math.floor(Math.random() * e.length);
  const g = e[f];
  const h = encodeURIComponent(d.join(" "));

  if (!h) {
    const i = await new Promise(j => {
      b.sendMessage('Please provide a question first!', c.threadID, (k, l) => {
        j(l);
      });
    });

    setTimeout(() => {
      b.unsendMessage(i.messageID);
    }, 10000);

    return;
  }

  const m = await new Promise(n => { 
    b.sendMessage('🔍 Searching Please Wait....', c.threadID, (o, p) => {
      n(p);
    }, c.messageID);
  });

  const j = [
    "https://yt-video-production.up.railway.app/Deepseek-R1?ask=",
    "https://yt-video-production.up.railway.app/Deepseek-V3?ask="
  ];

  const k = Math.floor(Math.random() * j.length);
  const n = j[k];

  try {
    const s = await a.get(n + h);
    const t = k === 0
      ? `${g} | 𝗗𝗲𝗲𝗽𝘀𝗲𝗲𝗸 𝗥𝟭\n━━━━━━━━━━━━━${s.data.response}\n━━━━━ ✕━━━━━━`
      : `${g} | 𝗗𝗲𝗲𝗽𝘀𝗲𝗲𝗸 𝗩𝟯\n━━━━━━━━━━━━━${s.data.response}\n━━━━━ ✕━━━━━━`;

    b.editMessage(t, m.messageID);
  } catch (v) {
    b.sendMessage(v.message, c.threadID, c.messageID);
  }
};

module.exports = dp;
