const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const DriveApi = require('./drive-api');
const StreamUtils = require('./streamUtils');
const driveApi = new DriveApi();

app.use(express.static(path.join(__dirname, 'public')))

app.get('/video/:id', async (req, response) => {  
  const range = req.headers.range;
  const videoId = req.params.id;
  const videos = await driveApi.listVideoFiles();
  const videoList = videos.filter(video => video.id === videoId);
  
  if (videoList.length === 0) {
    response.status(404).send('Not found');
  } 
  
  if (range) {
    const videoParams = StreamUtils.buildRangeParams(range, videoList[0]);
    const callback = (error, res) => {
      return StreamUtils.streamToResponse(error, res, response, videoParams);
    }

    driveApi.downloadFile(videoId, callback ,videoParams.start, videoParams.end)
  }
})

app.get('/list', async (req, response) => {
    const files = await driveApi.listVideoFiles();
    response.send(files);
})
const PORT = process.env.PORT || 3000
app.listen(PORT, function () {
  console.log('Listening on port!' + PORT)
})