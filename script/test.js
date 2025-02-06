const ax = require('axios');

let t;

t = {
  config: {
    name: "test",
    version: "68",
    role: 0,
    hasPrefix: false,
    credits: "Developer",
    description: "api tester",
    aliases: ["apitest"],
    cooldowns: 0
  },

  run: async function ({ api: a, event: e, args: ar }) {
    const u = ar.join(" ");

    if (!u || !/^https?:\/\//.test(u)) {
      const m = await new Promise(r => {
        a.sendMessage('Please provide a apiUrl with endpoint', e.threadID, (x, i) => {
          r(i);
        });
      });

      setTimeout(() => {
        a.unsendMessage(m.messageID);
      }, 10000);

      return;
    }

    try {
      const r = await ax.get(u, { headers: { Accept: "application/json" } });

      if (typeof r.data !== "object") {
        a.sendMessage("Invalid JSON response", e.threadID, e.messageID);
      }

      a.sendMessage("Response:\n\n" + JSON.stringify(r.data, null, 2), e.threadID, e.messageID);
    } catch (x) {
      a.sendMessage(x.message, e.threadID, e.messageID);
    }
  }
};

module.exports = t;
