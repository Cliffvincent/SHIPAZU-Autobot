const axios = require('axios');
const { google } = require('googleapis');
const mime = require('mime-types');
const fs = require('fs');
const path = require('path');
const getFBInfo = require("@xaviabot/fb-downloader");
const qs = require('qs');

function agent() {
    const chromeVersion = `${Math.floor(Math.random() * 6) + 130}.0.0.0`;
    const oprVersion = `${Math.floor(Math.random() * 5) + 86}.0.0.0`;
    return `Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion} Mobile Safari/537.36 OPR/${oprVersion}`;
}

const headers = {
    'User-Agent': agent()
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
            api.setMessageReaction("ðŸ“¥", event.messageID, () => {}, true);
            try {
                const dataa = await axios.get(`https://tikwm.com/api/?url=${encodeURIComponent(link)}&count=12&cursor=0&web=1&hd=1`);
                const { title, play, music, images } = dataa.data.data;
                if (images && images.length > 0) {
                    const imagePaths = [];
                    for (let i = 0; i < Math.min(images.length, 10); i++) {
                        const imgUrl = images[i];
                        const imgResponse = await axios.get(imgUrl, { responseType: 'arraybuffer' });
                        const imgPath = path.join(downloadDirectory, `${Date.now()}_${i}.jpg`);
                        fs.writeFileSync(imgPath, imgResponse.data);
                        imagePaths.push(fs.createReadStream(imgPath));
                    }
                    await api.sendMessage({
                        body: `ð– ð—Žð—ð—ˆ ð–£ð—ˆð—ð—‡ ð–³ð—‚ð—„ð–³ð—ˆð—„ (ð—œð—ºð—®ð—´ð—²ð˜€)\n\nð™²ðš˜ðš—ðšðšŽðš—ðš: ${title}\n\nð—¬ð—”ð—­ð—žð—¬ ð—•ð—¢ð—§ ðŸ®.ðŸ¬.ðŸ¬ð˜ƒ`,
                        attachment: imagePaths
                    }, event.threadID);
                    imagePaths.forEach((_, i) => {
                        const filePath = path.join(downloadDirectory, `${Date.now()}_${i}.jpg`);
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                        }
                    });
                }               
                if (play) {
                    const videoUrl = `https://www.tikwm.com${play}`;
                    const videoStream = await axios({
                        method: 'get',
                        url: videoUrl,
                        responseType: 'stream'
                    });
                    await api.sendMessage({
                        body: `ð– ð—Žð—ð—ˆ ð–£ð—ˆð—ð—‡ ð–³ð—‚ð—„ð–³ð—ˆð—„ (ð—©ð—¶ð—±ð—²ð—¼)\n\nð™²ðš˜ðš—ðšðšŽðš—ðš: ${title}\n\nð—¬ð—”ð—“ð—žð—¬ ð—•ð—¢ð—§ ðŸ®.ðŸ¬.ðŸ¬ð˜ƒ`,
                        attachment: videoStream.data
                    }, event.threadID, event.messageID);
                }              
            } catch (error) {
            }
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
                                resolve();
                            })
                            .on('error', (err) => {
                                reject(err);
                            })
                            .on('data', (d) => {
                                progress += d.length;
                            })
                            .pipe(dest);
                    });
                    await api.sendMessage({
                        body: `ð–¦ð—ˆð—ˆð—€ð—…ð–¾ ð–£ð—‹ð—‚ð—ð–¾ ð–«ð—‚ð—‡ð—„ \n\nð™µð™¸ð™»ð™´ð™½ð™°ð™¼ð™´: ${fileName}\n\nð—¬ð—”ð—­ð—žð—¬ ð—•ð—¢ð—§ ðŸ®.ðŸ¬.ðŸ¬ð˜ƒ`,
                        attachment: fs.createReadStream(destPath)
                    }, event.threadID, () => fs.unlinkSync(destPath), event.messageID);
                } catch (err) {
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
                    body: `ð– ð—Žð—ð—ˆ ð–£ð—ˆð—ð—‡ ð–¥ð–ºð–¼ð–¾ð–»ð—ˆð—ˆð—„\n\nTitle: ${result.title}\n\nð—¬ð—”ð—­ð—žð—¬ ð—•ð—¢ð—§ ðŸ®.ðŸ¬.ðŸ¬ð˜ƒ`,
                    attachment: videoData.data
                }, event.threadID);
            } catch (e) {
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
                            const messageBody = `ð– ð—Žð—ð—ˆ ð–£ð—ˆð—ð—‡ FB.Watch\n\nð—¬ð—”zð—žð—¬ ð—•ð—¢ð—§ ðŸ®.ðŸ¬.ðŸ¬ð˜ƒ`;
                            api.sendMessage({
                                body: messageBody,
                                attachment: fs.createReadStream(filePath)
                            }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
                        });
                    }
                }
            }
        } catch (err) {
        }
    }

    if (event.body !== null) {
        const instagramRegex = /https:\/\/www\.instagram\.com\/reel\/[a-zA-Z0-9_-]+\/\?igsh=[a-zA-Z0-9_=-]+$/;
        const url = event.body;
        if (instagramRegex.test(url)) {
            try {
                const response = await axios.get(`https://betadash-api-swordslush-production.up.railway.app/instadl?url=${encodeURIComponent(url)}`);
                const result = response.data.result;
                if (result && result.length > 0) {
                    const media = result[0];
                    const mediaResponse = await axios.get(media.url, { responseType: 'stream' });
                    const filePath = path.join(downloadDirectory, `${Date.now()}.mp4`);
                    const fileStream = fs.createWriteStream(filePath);
                    mediaResponse.data.pipe(fileStream);
                    fileStream.on('finish', () => {
                        api.sendMessage({
                            body: `ð– ð—Žð—ð—ˆ ð–£ð—ˆð—ð—‡ ð–¨ð—‡ð—Œð—ð–ºð—€ð—‹ð–ºð—†\n\nð—¬ð—”ð—“ð—žð—¬ ð—•ð—¢ð—§ ðŸ®.ðŸ¬.ðŸ¬ð˜ƒ`,
                            attachment: fs.createReadStream(filePath)
                        }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
                    });
                }
            } catch (e) {
                console.error(e);
            }
        }
    }
};

module.exports = download;
