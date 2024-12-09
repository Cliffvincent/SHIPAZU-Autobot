const fs = require('fs');
const path = require('path');
const axios = require('axios');

let source = {};

source["config"] = {
  name: 'scrape',
  version: '1.1.1',
  role: 0,
  hasPermission: 0,
  credits: "cliff",
  description: 'Scraping Web and api/output',
  usePrefix: false,
  hasPrefix: false,
  commandCategory: 'url',
  usage: '{pn} [url]',
  usages: '{pn} [url]',
  cooldown: 0,
  cooldowns: 0,
};

source["run"] = async function({ api, event, args }) {
  const uniqueFileName = path.join(__dirname, `/cache/snippet_${Math.floor(Math.random() * 1e6)}.txt`);
  let url = args.join(' ');

  try {
    if (!url) {
      return api.sendMessage('Please provide a URL you want to scrape.', event.threadID, event.messageID);
    }

    const cliff = await new Promise(resolve => {
      api.sendMessage('Scraping website, please wait a few seconds...', event.threadID, (err, info1) => {
        resolve(info1);
      }, event.messageID);
    });

    const response = await axios.get(`https://yt-video-production.up.railway.app/scrape?url=${encodeURIComponent(url)}`);
    const responseData = response.data.data;

    const contentToSend = responseData.substring(0, 20000); 
    const ughContent = responseData;
    const formattedContent = { data: responseData };

    let sheshh = `Here's the scraped data:\n\n${contentToSend}\n\n𝗡𝗢𝗧𝗘: The scraped data is too long to send in a single message. The word count limit for sending messages on Facebook Messenger is 20,000 characters.\n\nTo view the full result, please click or download the attached txt file`;

    fs.writeFileSync(uniqueFileName, `${ughContent}\n\n${JSON.stringify(formattedContent, null, 2)}`, 'utf8');

    api.unsendMessage(cliff.messageID);
    api.sendMessage({ body: sheshh, attachment: fs.createReadStream(uniqueFileName) }, event.threadID, event.messageID);
  } catch (err) {
    return api.sendMessage('Error Skills issue', event.threadID, event.messageID);
  }
};

module.exports = source;
