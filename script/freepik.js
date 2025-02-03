const config = {
  name: "freepik",
  version: "1.0",
  credits: "Kenneth Aceberos",
  description: "Search images based on Freepik",
  role: 0,
  aliases: ["Freepik"],
  hasPrefix: false,
  cooldown: 5,
};

const axios = require("axios");
const fs = require("fs");

module.exports = {
  config,
  async run({ api, event, args, prefix }) {
    const input = args.join(" ");
    if (!input)
      return api.sendMessage(
        `Invalid args ❌\nUsage: ${config.name} [search]`,
        event.threadID,
        event.messageID
      );

    try {
      const response = await axios.get(
        "https://betadash-api-swordslush.vercel.app/freepik",
        { params: { search: input } }
      );

      const result = response.data.images.slice(0, 20);

      if (result.length === 0)
        return api.sendMessage(`${input} not found.`, event.threadID, event.messageID);

      const images = [];
      const paths = [];

      for (const imageUrl of result) {
        const path = `${__dirname}/cache/${Math.random().toString(36).substring(2)}.png`;
        const image = await axios.get(imageUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(path, Buffer.from(image.data, "utf-8"));
        images.push(fs.createReadStream(path));
        paths.push(path);
      }

      api.sendMessage(
        { attachment: images },
        event.threadID,
        () => {
          for (const path of paths) {
            fs.unlinkSync(path);
          }
        },
        event.messageID
      );
    } catch (error) {
      api.sendMessage(error.message, event.threadID, event.messageID);
    }
  },
};