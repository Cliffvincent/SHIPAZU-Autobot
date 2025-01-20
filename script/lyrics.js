module.exports.config = {
  name: "lyrics",
  role: 0, 
  description: "Search Lyrics",
  usage: "[title of song]",
  credits: "deku & remod to mirai by Eugene Aguilar",
  cooldown: 0,
  hasPrefix: false
};

module.exports["run"] = async function({ api, event, args }) {
  const fs = require("fs");
  const axios = require("axios");
  const t = args.join(" ");

  if (!t) return api.sendMessage("The title of the song is missing.", event.threadID, event.messageID);

  try {
    const r = await axios.get(`https://betadash-api-swordslush.vercel.app/lyrics-finder?title=${encodeURIComponent(t)}`);
    const { response, Thumbnail, artist, Title } = r.data;

    let ly = __dirname + "/cache/lyrics.png";
    let suc = (await axios.get(Thumbnail, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(ly, Buffer.from(suc, "utf-8"));
    let img = fs.createReadStream(ly);

    api.setMessageReaction("🎼", event.messageID, (err) => {}, true);

    return api.sendMessage({
      body: `𝗧𝗶𝘁𝗹𝗲: ${title}\n\n${response}`,
      attachment: img
    }, event.threadID, () => fs.unlinkSync(ly), event.messageID);
  } catch (a) {
    api.setMessageReaction("😿", event.messageID, (err) => {}, true);

    return api.sendMessage(a.message, event.threadID, event.messageID);
  }
}
