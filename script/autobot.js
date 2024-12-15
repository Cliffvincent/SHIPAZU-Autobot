const axios = require('axios');

let a = {};

a["config"] = {
  name: "autobot",
  aliases: ["fbbot"],
  description: "This command makes your account a bot",
  hasPrefix: false,
  credits: "cliff",
  usage: "{p}autobot online  {p}autobot create <reply_message_state> <prefix> <bot_name> <adminName> <your_uid>",
  version: "1.0.0",
  role: 0,
  cooldown: 0
};

a["run"] = async ({ api, event, args, admin, prefix }) => {
/**  if (!admin.includes(event.senderID))
    return api.sendMessage("This command is only for AUTOBOT owner.", event.threadID, event.messageID); **/

function formatFont(text) {
      const fontMapping = {
          a: '𝚊', b: '𝚋', c: '𝚌', d: '𝚍', e: '𝚎', f: '𝚏', g: '𝚐', h: '𝚑', i: '𝚒', j: '𝚓', k: '𝚔', l: '𝚕', m: '𝚖',
          n: '𝚗', o: '𝚘', p: '𝚙', q: '𝚚', r: '𝚛', s: '𝚜', t: '𝚝', u: '𝚞', v: '𝚟', w: '𝚠', x: '𝚡', y: '𝚢', z: '𝚣',
          A: '𝙰', B: '𝙱', C: '𝙲', D: '𝙳', E: '𝙴', F: '𝙵', G: '𝙶', H: '𝙷', I: '𝙸', J: '𝙹', K: '𝙺', L: '𝙻', M: '𝙼',
          N: '𝙽', O: '𝙾', P: '𝙿', Q: '𝚀', R: '𝚁', S: '𝚂', T: '𝚃', U: '𝚄', V: '𝚅', W: '𝚆', X: '𝚇', Y: '𝚈', Z: '𝚉',
      };

      return text.split('').map((char) => fontMapping[char] || char).join('');
  }


function formatFontt(text) { 
  const fontMapping = {
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂", j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆",
    n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋", s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨", J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬",
    N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱", S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹"
  };

  return text.split('').map((char) => fontMapping[char] || char).join('');
  }


  const input = args[0];
  let input_state, input_prefix, input_botName, input_adminName, input_admin;

  if (event.type === "message_reply") {
    input_state = event.messageReply.body;
    input_prefix = args[1];
    input_botName = args[2];
    input_adminName = args[3];
    input_admin = args[4];
  }

  if (!input) {
    return api.sendMessage(
      `This command makes your account a bot by providing requirements. Use: autobot online or autobot create <reply_message_state> <prefix> <botName> <adminName> <admin_uid>`,
      event.threadID,
      event.messageID
    );
  } else if (input === "online") {
    try {
      const cliff = await new Promise(resolve => {
        api.sendMessage('⏳ Checking active session, Please wait...', event.threadID, (err, info1) => {
          resolve(info1);
        }, event.messageID);
      });      
 const g = "https://i.imgur.com/xkNfU7q.jpeg";     
      const j = await axios.get(g, { responseType: 'stream' });
      const urlsz = "http://fred.hidencloud.com:25833/info";
      const responsee = await axios.get(urlsz);
      const aiList = responsee.data;

      let message = "";
      if (Array.isArray(aiList)) {
        aiList.forEach((result, index) => {
          const { name, profileUrl, time } = result;
          const days = Math.floor(time / (3600 * 24));
          const hours = Math.floor((time % (3600 * 24)) / 3600);
          const minutes = Math.floor((time % 3600) / 60);
          const seconds = Math.floor(time % 60);
const bayot = formatFontt(name);
const lubot = formatFontt(`${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`);
          message += `[ ${index + 1} ]\n𝗡𝗔𝗠𝗘: ${bayot}\n𝗨𝗣𝗧𝗜𝗠𝗘: ${lubot}\n\n`;
        });
        api.editMessage(`𝙻𝚒𝚜𝚝 𝚘𝚏 𝙰𝚌𝚝𝚒𝚟𝚎 𝙱𝚘𝚝𝚜.\n\n${message}`, cliff.messageID);
      } else {
        api.sendMessage("Error: aiList is not an array.", event.threadID, event.messageID);
      }
    } catch (err) {
      api.sendMessage(err.message, event.threadID, event.messageID);
      console.log();
    }
  } else if (input === "create") {
    if (!input_state || !input_prefix || !input_botName || !input_adminName || !input_admin) { 
      return api.sendMessage(`Invalid usage: Use ${prefix}autobot create <reply_message_state> <prefix> <bot_name> <adminName> <your_uid>\n\nNote: unsend faster the fbstate cookie if your drop in this group be aware to thief and hackers`, event.threadID, event.messageID);
    }

    try {
      const states = JSON.parse(input_state);
      if (states && typeof states === 'object') {
    const cmds = [{
          "commands":["4chan","discolm","active-session","accept","ad","ada","adav2","adc","adduser","admin","affect","ai","alchemy","alluser","arrest","Artify","ascii","ask","autobot","babbage","babbagev2","babbagev3","badwords","bbm","beautiful","besh","bgblur","billboard","changebio","blackbox","blackboxv2","blacklist","blink","board","sharedbooster","braintest","callad","charcode","chat","claude","claude-upos","claude-haiku","claude-sonnet","claude-sonnetv2","claude-2.1","clean","clown","code-davinci","cohere","compile","adminoti","counttext","countmember","curie","curiev2","dalle","davinci","davinciv2","davinciv3","davinciv4","deepfry","deepseek","del","delete","dictionary","drake","dream","egif","einstein","emi","emojimix","enrile","eval","fbcover","fbcoverv2","fbcoverv3","fbpost","fbreport","file","filter","findgay","flux","flux1","flux2","flux3","flux4","flux5","fluxpro","fuck","gdrive","gemini-pro","gemini","gemini2","gemini-flash","gemma","cookie","getlink","github","glen","glm","gogo","goiadminn","goi","group","gpt-4-0613","gpt-4","gpt-4v2","gpt","gpt-3.5-turbo-16k","gpt3-3.5-turbo","gpt3","gpt3turbo","gpt-4-32k","gpt4-32k-v2","gpt4","gpt4o-free","gpt4o-freev2","gpt4o-mini-free","gpt4o-mini","gpt4o","gpt4turbo","gptfun","gptgo","grok","grok-2","hack","hastebin","help","hercai","hitler","hug","hug2","image","imgbb","imgur","impostor","info","insult","ip","jail","jessica","jesus","joke","kick","kickall","kiss","kiss2","lexi","listbox","listfriend","llava","meta3","lyrics","marcos","mark","mixtral","moonshot","nemo","nglspamm","nokia","sendnoti","nova","npm","obfuscate","okeyai","openai","out","outall","pacquiao","paint","pair","pastebin","pending","pet","phub","pinterest","poli","polyglot","pooh","popcat","prefix","prodia","proxy","quote","qwen","react","recipe","removebg","restart","reverse","riddle","rip","rules","say","scrape","sdxl","autoseen","setavt","setemoji","shell","calculate","shorten","shoti","shoticron","sim","simpson","batmanslap", "sc","spamkick","spank","sponge","spotify","spt","screenshot","stalk","stream","faceswap","tattoo","tempm","tempnum","thread","tid","tiktok","track","trans","trash","trigger","trump","uid","uid2","unsend","upscale","uptime","user","video","videov2","wanted","war","weather","whowouldwin", "faceswap", "meta", "lbc", "spamsms", "bogart"
          ]
        }, {
          "handleEvent": [
            "update_noti", 
            "autopost",
            "media-downloader",
            "greetings", 
            "autoreact"
          ]
        }];

        const create = await new Promise(resolve => {
          api.sendMessage('Creating bot, please wait...', event.threadID, (err, info1) => {
            resolve(info1);
          }, event.messageID);
        });

        const response = await axios({
          url: 'http://fred.hidencloud.com:25833/login',
          method: "POST",
          headers: {
           'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
           'Accept': 'application/json',
           'Content-Type': 'application/json'
           },
          data: {
            state: states,
            commands: cmds,
            prefix: input_prefix,
            botName: input_botName,
            adminName: input_adminName,
            admin: input_admin
          }
        });

        const data = response.data;
        if (data.success === 200) {
          api.editMessage(`${data.message}`, create.messageID);
        } else {
          api.editMessage(`${data.message}`, create.messageID);
        }
      } else {
        api.sendMessage('Invalid JSON data. Please check your input.', event.threadID, event.messageID);
      }
    } catch (parseErr) {
      api.sendMessage(`${parseErr.message}`, event.threadID, event.messageID);
      console.error();
    }
  }
};

module.exports = a;
