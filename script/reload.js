const fs = require("fs");

module.exports.config = {
  name: "reload",
  version: "1.0.0",
  role: 2,
  credits: "cliff",
  description: "Reload a command without restarting the bot",
  hasPrefix: false,
  aliases: ["rl"],
  usage: "[reload ]",
  cooldown: 5,
};

module.exports.run = async function ({ api, event, args }) {
  if (!args[0]) return api.sendMessage("⚠️ Please provide the command name to reload.", event.threadID, event.messageID);

  const commandName = args[0].toLowerCase();
  const filePath = __dirname + '/' + commandName + '.js';
  try {
    delete require.cache[require.resolve(filePath)];
    require(filePath);
  } catch (err) {
    return api.sendMessage(`❌ Failed to reload command: ${commandName}\n\nError: ${err.message}`, event.threadID, event.messageID);
  }

  try {
    let history = JSON.parse(fs.readFileSync('./data/history.json', 'utf-8'));
    let changed = false;
    if (Array.isArray(history)) {
      history.forEach((entry) => {
        if (!entry || !Array.isArray(entry.enableCommands)) return;
        entry.enableCommands.forEach((obj) => {
          if (!obj || !Array.isArray(obj.commands)) return;
          if (!obj.commands.includes(commandName)) {
            obj.commands.push(commandName);
            changed = true;
          }
        });
      });
    }
    if (changed) fs.writeFileSync('./data/history.json', JSON.stringify(history, null, 2), 'utf-8');
    return api.sendMessage(`✅ Reloaded command: ${commandName}${changed ? " and updated history.json" : " (already present in history.json)"}`, event.threadID, event.messageID);
  } catch (err) {
    return api.sendMessage(`❌ Reloaded command but failed to update history.json\n\nError: ${err.message}`, event.threadID, event.messageID);
  }
};
