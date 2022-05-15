const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();
const PORT = 4000;

app.use(cors());

app.listen(PORT, () => {
  console.log(`Server Works !!! At port ${PORT}`);
});

app.get('/download/mp3', async (req, res, next) => {
  try {
    var url = req.query.url;
    if (!ytdl.validateURL(url)) {
      return res.sendStatus(400);
    }

    let title = 'audio';
    const videoInfo = await ytdl.getBasicInfo(url, { format: 'mp4' });
    title = videoInfo.player_response.videoDetails.title.replace(/[^\x00-\x7F]/g, "");

    res.setHeader('Access-Control-Expose-Headers', 'Content-Filename');
    res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
    res.setHeader('Content-Type', 'audio/mp3');
    res.setHeader('Content-Filename', `${title}.mp3`);
    res.setHeader('Expires', '0');
    res.setHeader('Cache-Control', 'must-revalidate');
    res.setHeader('Pragma', 'public');

    ytdl(url, {
      format: 'mp3',
      filter: 'audioonly',
    }).pipe(res);

  } catch (err) {
    console.error(err);
  }
});
