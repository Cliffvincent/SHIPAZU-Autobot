const _0xkg = require('axios');

const n = String.fromCharCode(109, 117, 115, 105, 99);
const d = String.fromCharCode(80, 108, 97, 121, 32, 97, 32, 115, 111, 110, 103, 32, 102, 114, 111, 109, 32, 89, 111, 117, 84, 117, 98, 101);

module.exports.config = {
  name: n,
  version: "2.0.6",
  role: 0,
  hasPermission: 0,
  credits: "Jonell",
  description: d,
  commandCategory: "Media",
  usage: "[title]",
  usePrefix: false,
  hasPrefix: false,
  aliases: [String.fromCharCode(115, 105, 110, 103)],
  cooldown: 0
};

module.exports.run = async ({ api: _0xjh, event: _0vlg, args: _0plh }) => {
  const _0clh = _0plh.join(" ");

  try {
    if (!_0clh) {
      const _0hlg = await new Promise(_0rlh => {
        _0xjh.sendMessage(String.fromCharCode(80, 76, 69, 65, 83, 69, 32, 80, 82, 79, 86, 73, 68, 69, 32, 65, 32, 83, 79, 78, 71, 32, 84, 73, 84, 76, 69), _0vlg.threadID, (_0klh, _0nlg) => {
          _0rlh(_0nlg);
        });
      });

      setTimeout(() => {
        _0xjh.unsendMessage(_0hlg.messageID);
      }, 10000);
      return;
    }

    const _0slh = await _0xjh.sendMessage(`𝚂𝙴𝙰𝚁𝙲𝙷𝙸𝙽𝙶 𝙵𝙾𝚁 "${_0clh}"`, _0vlg.threadID);
    const _0tlh = `https://betadash-search-download.vercel.app/yt?search=${_0clh}`;
    const _0ulh = await _0xkg.get(_0tlh);
    const _0vlh = _0ulh.data[0];
    const _0wlh = _0vlh.url;

    let _0xlh = JSON.stringify({ query: _0wlh });
    let _0ylh = {
      method: "POST",
      url: "https://mp3juice.at/api/yt-data",
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      data: _0xlh
    };

    const _0zlh = await _0xkg.request(_0ylh);
    const _0alh = _0zlh.data.items[0];
    const _0blh = _0alh.id;
    const _0clh = _0alh.title;

    const _0dph = {
      method: 'GET',
      url: `https://c01-h01.cdnframe.com/api/v4/info/${_0blh}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36',
        'Accept': 'application/json'
      }
    };

    const _0eph = await _0xkg.request(_0dph);
    const _0fph = _0eph.data.formats.audio.mp3.find(_0gph => _0gph.quality === 128).token;

    const _0hph = JSON.stringify({ token: _0fph });
    const _0iph = {
      method: 'POST',
      url: 'https://c01-h01.cdnframe.com/api/v4/convert',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: _0hph
    };

    const _0jph = await _0xkg.request(_0iph);
    const _0kph = _0jph.data.jobId;

    const _0lph = {
      method: 'GET',
      url: `https://c01-h01.cdnframe.com/api/v4/status/${_0kph}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36',
        'Accept': 'application/json'
      }
    };

    const _0mph = await _0xkg.request(_0lph);
    const _0nph = _0mph.data.download;

    const _0oph = await _0xkg.get(_0nph, { responseType: 'stream' });

    _0xjh.sendMessage({
      body: `💽 Now playing: ${_0clh}`,
      attachment: _0oph.data
    }, _0vlg.threadID, _0vlg.messageID);

    _0xjh.unsendMessage(_0slh.messageID);
  } catch (_0pph) {
    const _0qph = await new Promise(_0rph => {
      _0xjh.sendMessage('[ERROR] ' + _0pph, _0vlg.threadID, (_0sph, _0tph) => {
        _0rph(_0tph);
      });
    });

    setTimeout(() => {
      _0xjh.unsendMessage(_0qph.messageID);
    }, 10000);
  }
};
