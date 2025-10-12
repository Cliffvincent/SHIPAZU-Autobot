const fs = require("fs");

module.exports.config = {
  name: "reload",
  version: "1.0.0",
  role: 2,
  credits: "cliff",
  description: "Reload a command without restarting the bot",
  hasPrefix: false,
  aliases: ["rl"],
  usage: "[reload <command name>]",
  cooldown: 5,
};

module.exports.run = async function ({ api, event, args }) {
  if (!args[0])
    return api.sendMessage("⚠️ Please provide the command name to reload.", event.threadID, event.messageID);

  const commandName = args[0].toLowerCase();
  const filePath = `${__dirname}/${commandName}.js`;

  try {
    delete require.cache[require.resolve(filePath)];
    require(filePath);

    let history = JSON.parse(fs.readFileSync('./data/history.json', 'utf-8'));
    history.forEach((entry) => {
      const enableCmds = entry.enableCommands.find(e => e.commands);
      if (enableCmds && !enableCmds.commands.includes(commandName)) {
        enableCmds.commands.push(commandName);
      }
    });
    fs.writeFileSync('./data/history.json', JSON.stringify(history, null, 2));

    return api.sendMessage(`✅ Successfully reloaded command: ${commandName} and updated history.json`, event.threadID, event.messageID);
  } catch (err) {
    return api.sendMessage(`❌ Failed to reload command: ${commandName}\n\nError: ${err.message}`, event.threadID, event.messageID);
  }
};
