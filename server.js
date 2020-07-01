// Require dependencies
const logger = require('morgan');
const express = require('express');


// Create an Express application
const app = express();
// Configure the app port
const port = process.env.PORT || 3000;
app.set('port', port);
// Load middlewares
app.use(logger('dev'));
const bodyParser = require('body-parser');
const { insertToVideo } = require('./src/db');
const { fetchConvertUrlFromDb } = require('./src/cralwer');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.get('/crawler', (req, res, next) => {
    let html = fetchHtmlFromUrl("http://xem.vn/video/mon-ngon-moi-ngay-cho-ace-xem-080022.html");
    html.then(data => {
        sendResponse(res, data);
        // console.log(data);
    }).catch(error => {
        sendResponse(res, error)
    })

});


app.post('/addUrl', (req, res, next) => {
    console.log(req.body);
    fetchConvertUrlFromDb(req.body.url)
        .then(url =>
            insertToVideo({
                title: req.body.title,
                url: req.body.url,
                cache_url: url
            })
        )
        .then(data => {
            console.log(data);
            sendResponse(res, data);
        })
        .catch(err => {
            sendResponse(res, err);
        })
        // insertToVideo(req.body).then((result) => {
        //     sendResponse(res, { status: "success", data: req.body });
        // }).catch((error) => {
        //     sendResponse(res, { status: "failed", error: error });
        // })
})

const sendResponse = (res, data) => {
    res.json(data)
};



// Start the server and listen on the preconfigured port
app.listen(port, () => console.log(`App started on port ${port}.`))