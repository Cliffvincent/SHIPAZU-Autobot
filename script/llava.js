module.exports.config = {
  name: 'llava',
  version: '1.1.1',
  hasPermssion: 0,
  role: 0,
  credits: "cliff",
  author: '',
  description: 'An AI powered by openai',
  usePrefix: false,
  hasPrefix: false,
  commandCategory: 'AI',
  usage: '[prompt]',
  cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
  const axios = require('axios');

  let user = args.join(' ');

  try {
      if (!user) {
          return api.sendMessage('Please provide a question first!', event.threadID, event.messageID);
      }

      const cliff = await new Promise(resolve => { 
        api.sendMessage('🔍 Searching Please Wait....', event.threadID, (err, info1) => {
          resolve(info1);
        }, event.messageID);
      });

      const response = await axios.get(`https://nash-rest-api-production.up.railway.app/llava?q=${encodeURIComponent(user)}`);

      const responseData = response.data.response;
      const formattedResponse = `❂ | 𝗟𝗟𝗔𝗩𝗔 (𝗟𝗠𝗦𝗬𝗦)\n━━━━━━━━━━━━━━━━━━\n${responseData}\n━━━━━━━━━━━━━━━━━━`;

      api.editMessage(formattedResponse, cliff.messageID);
  } catch (err) {
      return api.sendMessage('Api error i think it cause serverless in vercel', event.threadID, event.messageID);
  }
};
