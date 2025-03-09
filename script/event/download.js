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
    (async () => {
      const apiKey = 'AIzaSyCYUPzrExoT9f9TsNj7Jqks1ZDJqqthuiI';
      if (!apiKey) {
        return;
      }

      const drive = google.drive({ version: 'v3', auth: apiKey });
      const gdriveLinkPattern = /(?:https?:\/\/)?(?:drive\.google\.com\/(?:folderview\?id=|file\/d\/|open\?id=))([\w-]{33}|\w{19})(&usp=sharing)?/gi;
      let match;

      while ((match = gdriveLinkPattern.exec(event.body)) !== null) {
        const fileId = match[1];

        try {
          const res = await drive.files.get({ fileId: fileId, fields: 'name, mimeType' });
          const fileName = res.data.name;
          const mimeType = res.data.mimeType;
          const extension = mime.extension(mimeType);
          const destFilename = `${fileName}${extension ? '.' + extension : ''}`;
          const destPath = path.join(downloadDirectory, destFilename);

          const dest = fs.createWriteStream(destPath);
          let progress = 0;

          const resMedia = await drive.files.get(
            { fileId: fileId, alt: 'media' },
            { responseType: 'stream' }
          );

          await new Promise((resolve, reject) => {
            resMedia.data
              .on('end', () => {
                console.log();
                resolve();
              })
              .on('error', (err) => {
                console.error();
                reject(err);
              })
              .on('data', (d) => {
                progress += d.length;
                process.stdout.write(`Downloaded ${progress} bytes\r`);
              })
              .pipe(dest);
          });

          await api.sendMessage({ body: `𝖦𝗈𝗈𝗀𝗅𝖾 𝖣𝗋𝗂𝗏𝖾 𝖫𝗂𝗇𝗄 \n\n𝙵𝙸𝙻𝙴𝙽𝙰𝙼𝙴: ${fileName}\n\n𝗬𝗔𝗭𝗞𝗬 𝗕𝗢𝗧 𝟮.𝟬.𝟬𝘃`, attachment: fs.createReadStream(destPath) }, event.threadID, () => fs.unlinkSync(destPath),
        event.messageID);

          await fs.promises.unlink(destPath);
          console.log();
        } catch (err) {
          console.error();
        }
      }
    })();
  }

  if (event.body !== null) {
    const facebookLinkRegex = /https:\/\/www\.facebook\.com\/\S+/;

    const downloadAndSendFBContent = async (url) => {
      try {
        const result = await getFBInfo(url);
        const videoData = await axios.get(encodeURI(result.sd), { responseType: 'stream' });

        api.sendMessage({
          body: `𝖠𝗎𝗍𝗈 𝖣𝗈𝗐𝗇 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄\n\nTitle: ${result.title}\n\n𝗬𝗔𝗭𝗞𝗬 𝗕𝗢𝗧 𝟮.𝟬.𝟬𝘃`,
          attachment: videoData.data
        }, event.threadID);
      } catch (e) {
        console.error();
      }
    };

    if (facebookLinkRegex.test(event.body)) {
      downloadAndSendFBContent(event.body);
    }
  }

  if (event.body !== null) {
    const fbWatchRegex = /https:\/\/fb\.watch\/[a-zA-Z0-9_-]+/i;
    try {
      if (event.body !== null) {
        const url = event.body;
        if (fbWatchRegex.test(url)) {
          const res = await fbDownloader(url, { headers });
          if (res.success && res.download && res.download.length > 0) {
            const videoUrl = res.download[0].url;
            const response = await axios.get(videoUrl, { responseType: "stream" }, { headers });
            const filePath = path.join(downloadDirectory, `${Date.now()}.mp4`);
            const fileStream = fs.createWriteStream(filePath);
            response.data.pipe(fileStream);
            fileStream.on('finish', () => {
              const messageBody = `𝖠𝗎𝗍𝗈 𝖣𝗈𝗐𝗇 FB.Watch\n\n𝗬𝗔z𝗞𝗬 𝗕𝗢𝗧 𝟮.𝟬.𝟬𝘃`;
              api.sendMessage({
                body: messageBody,
                attachment: fs.createReadStream(filePath)
              }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
            });
          }
        }
      }
    } catch (err) {
      console.error();
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
