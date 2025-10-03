module.exports.config = {
  name: "tiktok",
  version: "1.0.0",
  role: 0,
  credits: "cliff",
  description: "tiktok search videos",
  hasPrefix: false,
  aliases: ["tik"],
  usage: "[Tiktok <search>]",
  cooldown: 5,
};

const axios = require("axios");

module.exports.run = async function ({ api, event, args }) {
  try {
    const searchQuery = args.join(" ");
    if (!searchQuery) {
      const messageInfo = await new Promise(resolve => {
        api.sendMessage(
          "Usage: tiktok <search text>",
          event.threadID,
          (err, info) => resolve(info),
          event.messageID
        );
      });
      setTimeout(() => {
        api.unsendMessage(messageInfo.messageID);
      }, 10000);
      return;
    }

    const ugh = await new Promise(resolve => {
      api.sendMessage(
        "⏱️ | Searching, please wait...",
        event.threadID,
        (err, info) => resolve(info),
        event.messageID
      );
    });

    const response = await axios.get(
      `https://betadash-search-download.vercel.app/tiksearch?search=${encodeURIComponent(searchQuery)}`
    );
    const videoData = response.data;

    if (!videoData || !videoData.url) {
      api.sendMessage("No videos found for the given search query.", event.threadID, null, event.messageID);
      return;
    }

    const videoUrl = videoData.url;
    const message = `𝐓𝐢𝐤𝐭𝐨𝐤 𝐫𝐞𝐬𝐮𝐥𝐭:\n\n𝐓𝐢𝐭𝐥𝐞: ${videoData.title}\n𝐃𝐮𝐫𝐚𝐭𝐢𝐨𝐧: ${videoData.duration}s\n𝐑𝐞𝐠𝐢𝐨𝐧: ${videoData.region}`;

    const videoResponse = await axios({
      method: "get",
      url: videoUrl,
      responseType: "stream"
    });

    api.unsendMessage(ugh.messageID);

    await api.sendMessage(
      { body: message, attachment: videoResponse.data },
      event.threadID,
      null,
      event.messageID
    );

  } catch (error) {
    await api.sendMessage(error.message, event.threadID, null, event.messageID);
  }
};
