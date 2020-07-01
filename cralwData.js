const { fetchUrlYoutubeVideo } = require('./src/cralwer');
const { insertToVideo } = require('./src/db');

fetchUrlYoutubeVideo().then((youtubeUrls) => {
    // console.log("youtubeUrls", youtubeUrls);
    youtubeUrls.map((value, index) => {
        insertToVideo(value);
    })

});