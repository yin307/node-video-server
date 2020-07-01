const request = require('request');
const cheerio = require('cheerio');
const { reject } = require('lodash');
const fetch = require('node-fetch');


const baseurl = "http://xem.vn";
const videoUrl = "http://xem.vn/video";

const hostConvert = "https://www.getfvid.com/downloader";

const fetchUrlVideo = async() => {
    let body = await fetchHtmlFromUrl(videoUrl);
    let $ = cheerio.load(body);
    let videoListItems = $('div.videoListItem');
    let links = [];
    videoListItems.each((index, item) => {
        let thumb = $(item).find('.thumb');
        thumb.each((index, item) => {
            let link = $(item).find('a').attr("href");
            // console.log(link);
            links.push(link)
        })
    })
    return links;
}

const fetchUrlYoutubeVideo = async() => {
    let links = await fetchUrlVideo();
    let youtubeUrls = [];
    for (let i = 0; i < links.length; i++) {
        // console.log(value);
        let body = await fetchHtmlFromUrl(baseurl + links[i]);
        let $ = cheerio.load(body);
        let videoDivs = $('div.video');
        let youtubeUrl = "";
        let title = "";
        videoDivs.each((index, item) => {
            youtubeUrl = $(item).find('meta').attr('content');
        })

        let mainInfos = $('div.mainInfo');
        mainInfos.each((index, item) => {
            title = $(item).find('h1').text();
            title = title.replace(/\n/g, '');
            title = title.replace(/\t/g, '');
        })

        if (youtubeUrl && youtubeUrl != "") {
            youtubeUrls.push({
                url: youtubeUrl,
                title: title,
                type: 'youtube'
            });
        }

    }
    return youtubeUrls;
}

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

const fetchConvertUrlFromDb = url => {
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

module.exports.fetchUrlYoutubeVideo = fetchUrlYoutubeVideo;
module.exports.fetchConvertUrlFromDb = fetchConvertUrlFromDb;