const axios = require("axios");

function formatFont(text) {
  const fontMapping = {
    a: "𝗮", b: "𝗯", c: "𝗰", d: "𝗱", e: "𝗲", f: "𝗳", g: "𝗴", h: "𝗵", i: "𝗶", j: "𝗷", k: "𝗸", l: "𝗹", m: "𝗺",
    n: "𝗻", o: "𝗼", p: "𝗽", q: "𝗾", r: "𝗿", s: "𝘀", t: "𝘁", u: "𝘂", v: "𝗩", w: "𝗪", x: "𝗫", y: "𝗬", z: "𝗭",
    A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜", J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠",
    N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥", S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭",
    0: "𝟬", 1: "𝟭", 2: "𝟮", 3: "𝟯", 4: "𝟰", 5: "𝟱", 6: "𝟲", 7: "𝟳", 8: "𝟴", 9: "𝟵"
  };
  return text.split("").map((char) => fontMapping[char] || char).join("");
}

module.exports.config = {
  name: "lepton",
  version: "2.0.6",
  role: 0,
  hasPermission: 0,
  credits: "Cloff",
  description: "Search using Lepton API",
  commandCategory: "Search",
  usage: "[title]",
  usePrefix: false,
  hasPrefix: false,
  aliases: ["sing"],
  cooldown: 0,
};

module.exports.run = async ({ api, event, args }) => {
  const search = args.join(" ");

  if (!search) {
    await api.sendMessage({ body: "Please provide a question first." }, event.threadID, event.messageID);
    return;
  }

  try {
    const url = `https://betadash-api-swordslush.vercel.app/lepton?search=${encodeURIComponent(search)}`;
    const response = await axios.get(url);
    const data = response.data;

    const answer = data.ANSWERS;
    const sources = data.SOURCES;
    const relatedQuestions = data.RELATED?.QUESTIONS || [];

    if (!answer) {
      await api.sendMessage({ body: "No results found." }, event.threadID, event.messageID);
      return;
    }

    let message = `󰦌 | 𝙻𝙴𝙿𝚃𝙾𝙽 𝚂𝙴𝙰𝚁𝙲𝙷\n━━━━━━━━━━━━\n${answer}\n\n${formatFont("SOURCE")}:\n`;

    sources.forEach((source) => {
      message += `${formatFont("Title")}: ${source.title}\n${formatFont("Link")}: ${source.url}\n${formatFont("Snippet")}: ${source.snippet}\n\n`;
    });

    message += "━━━━━ ✕ ━━━━━";

    await api.sendMessage({ body: message }, event.threadID, event.messageID);
  } catch (error) {
    await api.sendMessage({ body: error.message }, event.threadID, event.messageID);
  }
};
