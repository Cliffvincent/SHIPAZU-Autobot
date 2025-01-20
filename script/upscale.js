const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: "upscale",
  version: "1.0",
  role: 0,
  hasPermission: 0,
  credits: "hazey",
  description: "Enhance your photo",
  hasPrefix: false,
  usePrefix: false,
  commandCategory: "image",
  usages: "[reply to image]",
  cooldowns: 2,
  cooldown: 2,
  aliases: ["rem", "4k"],
  usage: "replying photo"
};

module.exports.run = async ({ api, event, args }) => {
  const pathie = __dirname + `/cache/remove_bg.jpg`;
  const { threadID, messageID } = event;

  const photoUrl = event.messageReply ? event.messageReply.attachments[0].url : args.join(" ");

  if (!photoUrl) {
    api.sendMessage("📸 Please reply to a photo to process and remove backgrounds.", threadID, messageID);
    return;
  }

  try {
    const findingMessage = await api.sendMessage(`🕟 | Upscaling Image, Please wait for a moment..`, event.threadID);
    
    const response = await axios.get(`https://yt-video-production.up.railway.app/upscale?imageUrl=${encodeURIComponent(photoUrl)}`);
    const processedImageURL = response.data.imageUrl;

    const img = (await axios.get(processedImageURL, { responseType: "arraybuffer" })).data;

    fs.writeFileSync(pathie, Buffer.from(img, 'binary'));

    api.sendMessage({
      body: "🔮 Image Successfully Enhanced",
      attachment: fs.createReadStream(pathie)
    }, threadID, () => fs.unlinkSync(pathie), messageID);
    api.unsendMessage(findingMessage.messsageID);
  } catch (error) {
    api.sendMessage(`Error processing image: ${error.message}`, threadID, messageID);
  }
};
