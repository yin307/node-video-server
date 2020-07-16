const mysql = require('mysql');
const { dbConfig } = require('./config');

const pool = mysql.createPool(dbConfig);

module.exports.insertToVideo = async data => {
    const sql = `INSERT INTO video (title, url, type, cache_url) values ("${data.title}", "${data.url}", "${data.type ? data.type : 'facebook'}", "${data.cache_url ? data.cache_url : ''}")`;
    return excute(sql);
}

module.exports.getVideos = () => {
    const sql = `SElECT * FROM video order by id desc limit 10`;
    return excute(sql);
}

const excute = (sql) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            connection.query(sql, (err, res) => {
                connection.release();
                if (err) {
                    reject(err)
                }

                resolve({ status: "success", data: res });
            })
        })
    })

}