module.exports.config = {
  name: "reload",
  version: "1.0.0",
  role: 2, // admin only
  credits: "cliff",
  description: "Reload a command without restarting the bot",
  hasPrefix: false,
  aliases: ["rl"],
  usage: "[reload <command name>]",
  cooldown: 5,
};

module.exports.run = async function ({ api, event, args }) {
  if (!args[0]) return api.sendMessage("⚠️ Please provide the command name to reload.", event.threadID, event.messageID);

  const commandName = args[0].toLowerCase();
  try {
    // Path to the command
    const filePath = `${__dirname}/${commandName}.js`;

    // Delete from cache
    delete require.cache[require.resolve(filePath)];

    // Re-require the command
    require(filePath);

    return api.sendMessage(`✅ Successfully reloaded command: ${commandName}`, event.threadID, event.messageID);
  } catch (err) {
    return api.sendMessage(`❌ Failed to reload command: ${commandName}\n\nError: ${err.message}`, event.threadID, event.messageID);
  }
};
