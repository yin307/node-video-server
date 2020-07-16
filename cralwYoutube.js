const { fetchUrlYoutubeVideo, convertYoutubeUrl, cralwVideoFromChannel } = require('./src/cralwer');
const { insertToVideo } = require('./src/db');

// fetchUrlYoutubeVideo().then((res) => {
//     console.log(res);
//     res.map((value, index) => {
//         convertYoutubeUrl(value.url);
//     })
// });

const channels = ['https://www.youtube.com/channel/UCcbJH5X9RCXZ7JxOUb7dBzA/videos']

cralwVideoFromChannel('https://www.youtube.com/channel/UCcbJH5X9RCXZ7JxOUb7dBzA/videos').then(videos => {
    console.log(videos);
    videos.map((value, index) => {
        let url = 'https://www.youtube.com/watch?v=' + value.id;
        convertYoutubeUrl(url).then(res =>
            insertToVideo({
                title: value.title,
                url: url,
                cache_url: res,
                type: "youtube"
            })
        ).then(res => {
            console.log(res);
        })

    })
})