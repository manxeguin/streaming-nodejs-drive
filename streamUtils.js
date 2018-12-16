const StreamUtils = {
    buildHeadResponse: function(start, end, fileSize, chunksize) {
        return {'Content-Range': `bytes ${start}-${end}/${fileSize}`, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4'}
    },
    buildRangeParams: function(range, video) {
        const videoRes = {};
        videoRes.fileSize = parseInt(video.size, 10);
        const parts = range
          .replace(/bytes=/, "")
          .split("-")
    
        videoRes.start = parseInt(parts[0], 10)
        videoRes.end = parseInt(parts[1]) > 0 ? parseInt(parts[1], 10) : videoRes.fileSize - 1
        videoRes.chunksize = (videoRes.end - videoRes.start) + 1;

        return videoRes;
    },
    streamToResponse: function(error, res, response, video) {

        response.writeHead(206, this.buildHeadResponse(video.start, video.end, video.fileSize, video.chunksize));

        if (res) {
            res.data.on('end', () => {
                    console.log('Done');
                })
                .on('error', err => {
                    console.log('Error', err);
                })
                .pipe(response);
        } else {
            console.log('error', error);
        }
    }
}

module.exports = StreamUtils;