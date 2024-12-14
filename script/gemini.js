const a = require("axios");
const b = require("fs");

const c = {
  'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚',
  'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡',
  'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨',
  'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
  'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴',
  'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻',
  'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂',
  'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇'
};

function d(e) {
  return e.replace(/(?:\*\*(.*?)\*\*|## (.*?)|### (.*?))/g, (f, g, h, i) => {
    const j = g || h || i;
    return [...j].map(k => c[k] || k).join('');
  });
}

module.exports.config = {
  name: "gemini",
  role: 0,
  credits: "Deku",
  description: "Talk to Gemini (conversational)",
  hasPrefix: false,
  version: "5.6.7",
  aliases: ["bard"],
  usage: "gemini [prompt]"
};

module.exports.run = async function ({ api, event, args }) {
  const l = ["▞", "✦", "✧", "✦", "⟡", "ᯤ"];
  const m = Math.floor(Math.random() * l.length);
  const n = l[m];
  let o = encodeURIComponent(args.join(" ")),
      p;

  if (!o) {
    const q = await new Promise(r => {
      api.sendMessage('Please provide a prompt', event.threadID, (s, t) => {
        r(t);
      });
    });

    setTimeout(() => {
      api.unsendMessage(q.messageID);
    }, 10000);

    return;
  }

  const u = await new Promise(v => {
    api.sendMessage("🗨 | 𝙶𝚎𝚖𝚒𝚗𝚒 𝙰𝙸 𝚒𝚜 𝚝𝚑𝚒𝚗𝚔𝚒𝚗𝚐 𝚙𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝...", event.threadID, (w, x) => {
      v(x);
    });
  });

  try {
    if (event.type === "message_reply") {
      if (event.messageReply.attachments[0]?.type === "photo") {
        p = encodeURIComponent(event.messageReply.attachments[0].url);
        const y = (await a.get(`https://kaiz-apis.gleeze.com/api/gemini-vision?q=${o}&uid=${event.senderID}&imageUrl=${p}`)).data;
        const z = `${n} | 𝗚𝗘𝗠𝗜𝗡𝗜-𝗙𝗟𝗔𝗦𝗛\n━━━━━━━━━━━━━━━━━━\n${y.response}\n━━━━━━━━━━━━━━━━━━`;
        api.unsendMessage(u.messageID);
        return api.sendMessage(z, event.threadID);
      } else {
        api.unsendMessage(u.messageID);
        return api.sendMessage('Please reply to an image.', event.threadID);
      }
    }

    const A = (await a.get(`https://wieginews3787.onrender.com/gemini?question=${o}`)).data;
    const B = [];
    const C = A.imageUrls;

    if (C && C.length > 0) {
      for (let D = 0; D < C.length; D++) {
        try {
          const E = C[D];
          const F = (await a.get(E, { responseType: "arraybuffer" })).data;
          const G = __dirname + `/cache/gemini_image${D}.jpg`;
          b.writeFileSync(G, Buffer.from(F, "binary"));
          B.push(b.createReadStream(G));
        } catch (error) {}
      }
    }

    const H = d(A.answer);
    api.unsendMessage(u.messageID);

    api.sendMessage({
      body: `${n} | 𝗚𝗘𝗠𝗜𝗡𝗜-𝗣𝗥𝗢\n━━━━━━━━━━━━━━━━━━\n${H}\n━━━━━━━━━━━━━━━━━━`,
      attachment: B,
    }, event.threadID, (I, J) => {
      if (I) return console.error(I);

      B.forEach((K) => {
        try {
          const L = K.path;
          if (L) {
            b.unlinkSync(L);
          }
        } catch (error) {}
      });
    });

  } catch (error) {
    api.unsendMessage(u.messageID);
    return api.sendMessage({ body: '404 NOT FOUND' }, event.threadID);
  }
};
