const request = require('request');
const cheerio = require('cheerio');
const { reject } = require('lodash');
const fetch = require('node-fetch');



const hostConvert = "https://www.getfvid.com/downloader";

// const fetchUrlVideo = async() => {
//     let body = await fetchHtmlFromUrl(videoUrl);
//     let $ = cheerio.load(body);
//     let videoListItems = $('div.videoListItem');
//     let links = [];
//     videoListItems.each((index, item) => {
//         let thumb = $(item).find('.thumb');
//         thumb.each((index, item) => {
//             let link = $(item).find('a').attr("href");
//             // console.log(link);
//             links.push(link)
//         })
//     })
//     return links;
// }

// const fetchUrlYoutubeVideo = async() => {
//     let links = await fetchUrlVideo();
//     let youtubeUrls = [];
//     for (let i = 0; i < links.length; i++) {
//         // console.log(value);
//         let body = await fetchHtmlFromUrl(baseurl + links[i]);
//         let $ = cheerio.load(body);
//         let videoDivs = $('div.video');
//         let youtubeUrl = "";
//         let title = "";
//         videoDivs.each((index, item) => {
//             youtubeUrl = $(item).find('meta').attr('content');
//         })

//         let mainInfos = $('div.mainInfo');
//         mainInfos.each((index, item) => {
//             title = $(item).find('h1').text();
//             title = title.replace(/\n/g, '');
//             title = title.replace(/\t/g, '');
//         })

//         if (youtubeUrl && youtubeUrl != "") {
//             youtubeUrls.push({
//                 url: youtubeUrl,
//                 title: title,
//                 type: 'youtube'
//             });
//         }

//     }
//     return youtubeUrls;
// }

const fetchHtmlFromUrl = async url => {
    return new Promise((resolve, reject) => {
        request(url, undefined, (error, res, body) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                resolve(body);
            }
        })
    });

};

//FB video==================

const convertFBUrl = url => {
    console.log(hostConvert);
    return new Promise((resolve, reject) => {
        fetch(hostConvert, {
                method: 'post',
                body: JSON.stringify({
                    url: url
                }),
                headers: { 'Content-Type': 'application/json' },
            }).then(res => res.text())
            .then(res => {
                try {

                    let $ = cheerio.load(res);
                    let divDownload = $('div.btns-download');
                    divDownload.each((index, item) => {
                        let url = $(item).find('p').first().find('a').first().attr('href');
                        resolve(url);
                    })
                } catch (err) {
                    reject(err);
                }
            })
            .catch(err => {
                reject(err);
            })
    })
}

//Youtube========================


const cralwVideoFromChannel = async channel => {
    let body = await fetchHtmlFromUrl(channel);
    let $ = cheerio.load(body);
    let scripts = $('script');
    let content = scripts[27].children[0].data;
    content = content.substring(0, content.search(";"))
    content = content.replace(`window["ytInitialData"] = `, '');
    // console.log(content.substring(0, 100));
    let jsonobject = JSON.parse(content);
    let items = jsonobject.contents.twoColumnBrowseResultsRenderer.tabs[1].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].gridRenderer.items;
    console.log("Found " + items.length + " videos");
    let videos = [];
    items.map((value, index) => {
        videos.push({
            title: value.gridVideoRenderer.title.simpleText,
            id: value.gridVideoRenderer.videoId
        })
    })

    return videos;
}

const convertYoutubeUrl = async url => {
    return new Promise((resolve, reject) => {
        fetch('https://get-video-youtbe.herokuapp.com/video_info.php?url=' + url)
            .then(res => res.json())
            .then(json => {
                resolve(json.links[0].url)
            }).catch(err => {
                reject(err);
            })
    })

}



module.exports.cralwVideoFromChannel = cralwVideoFromChannel;
module.exports.convertFBUrl = convertFBUrl;
module.exports.convertYoutubeUrl = convertYoutubeUrl;