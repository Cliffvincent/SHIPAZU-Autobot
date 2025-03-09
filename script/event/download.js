const axios = require('axios');
const { google } = require('googleapis');
const mime = require('mime-types');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const getFBInfo = require("@xaviabot/fb-downloader");
const qs = require('qs');

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  'Content-Type': 'application/json',
};

const download = {};

download["config"] = {
  name: "media-downloader",
  version: "69",
  credits: "Cliff",
  description: "Tiktok, googledrive, Facebook, fbwatch, instagram, youtube, capcut"
};

const downloadDirectory = path.resolve(__dirname, 'cache');

download["handleEvent"] = async function ({ api, event }) {
  if (event.body !== null) {
    const regEx_tiktok = /https:\/\/(www\.|vt\.)?tiktok\.com\//;
    const link = event.body;

    if (regEx_tiktok.test(link)) {
      api.setMessageReaction("📥", event.messageID, () => {}, true);
      try {
        const response = await axios.post(`https://www.tikwm.com/api/`, { url: link }, { headers });
        const data = response.data.data;
        const videoStream = await axios({
          method: 'get',
          url: data.play,
          responseType: 'stream'
        });

        api.sendMessage({
          body: `𝖠𝗎𝗍𝗈 𝖣𝗈𝗐𝗇 𝖳𝗂𝗄𝖳𝗈𝗄 \n\n𝙲𝚘𝚗𝚝𝚎𝚗𝚝: ${data.title}\n\n𝙻𝚒𝚔𝚎𝚜: ${data.digg_count}\n\n𝙲𝚘𝚖𝚖𝚎𝚗𝚝𝚜: ${data.comment_count}\n\n𝗬𝗔𝗭𝗞𝗬 𝗕𝗢𝗧 𝟮.𝟬.𝟬𝘃`,
          attachment: videoStream.data
        }, event.threadID);
      } catch (error) {}
    }
  }

  if (event.body !== null) {
    const instagramRegex = /https:\/\/www\.instagram\.com\/reel\/[a-zA-Z0-9_-]+\/\?igsh=[a-zA-Z0-9_=-]+$/;
    const syukk = event.body;

    if (instagramRegex.test(syukk)) {
      const downloadAndSendIGContent = async (url) => {
        try {
          const result = await igdl(url);
          if (result.length > 0) {
            const videoUrl = result[0].url;
            const videoData = await axios.get(videoUrl, { responseType: 'stream' }, { headers });
            const filePath = path.join(downloadDirectory, `${Date.now()}.mp4`);
            const fileStream = fs.createWriteStream(filePath);
            videoData.data.pipe(fileStream);
            fileStream.on('finish', () => {
              api.sendMessage({
                body: `𝖠𝗎𝗍𝗈 𝖣𝗈𝗐𝗇 𝖨𝗇𝗌𝗍𝖺𝗀𝗋𝖺𝗆\n\n𝗬𝗔𝗓𝗞𝗬 𝗕𝗢𝗧 𝟮.𝟬.𝟬𝘃`,
                attachment: fs.createReadStream(filePath)
              }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
            });
          }
        } catch (e) {}
      };

      downloadAndSendIGContent(event.body);
    }
  }
};

async function igdl(url) {
  const initialResponse = await axios("https://indown.io/", {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    },
  });

  const _$ = cheerio.load(initialResponse.data);

  const _token = _$('input[name="_token"]').val();
  const referer = "https://indown.io";
  const locale = "en";
  const p = "2001:4451:87ff:3300:d8f6:cbf8:d85f:a5c3";

  const { data } = await axios.post(
    "https://indown.io/download",
    new URLSearchParams({
      link: url,
      referer,
      locale,
      p,
      _token,
    }),
    {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded",
        cookie: initialResponse.headers["set-cookie"].join("; "),
      },
    }
  );

  const $ = cheerio.load(data);
  const result = [];
  const __$ = cheerio.load($("#result").html());
  __$("video").each(function () {
    const $$ = $(this);
    result.push({
      type: "video",
      thumbnail: $$.attr("poster"),
      url: $$.find("source").attr("src"),
    });
  });
  __$("img").each(function () {
    const $$ = $(this);
    result.push({
      type: "image",
      url: $$.attr("src"),
    });
  });

  return result;
}

module.exports = download;
