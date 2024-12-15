module.exports.config = {
  name: "getlink",
  version: "1.0",
  credits: "cliff",
  cooldown: 0,
  role: 0,
  hasPrefix: false,
  usage: "{prefix} <reply with img or vid>",
  description: "get link video/image"
};

module.exports.run = async function ({ api, event }) {
  const { messageReply } = event;

  if (event.type !== "message_reply" || !messageReply.attachments || messageReply.attachments.length !== 1) {
      return api.sendMessage("<Reply with image or video>", event.threadID, event.messageID);
  }

  return api.sendMessage(messageReply.attachments[0].ucot.threadID, event.messageID);
};
