const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const pg = require('pg');
const envvar = require('dotenv').config();

const pg_config = {
    host: 'mememadb-server.postgres.database.azure.com',
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: 5432,
    ssl: true
};

console.log(process.env.USERNAME, process.env.PASSWORD, process.env.DATABASE);

const client = new pg.Client(pg_config);

const app = express();
const port = process.env.PORT || 8080;

client.connect(async err => {
    if (err) throw err;
    await queryDB();
});

async function queryDB() {
    let data = await client.query(`select * from links`);
    data = data.rows;
    data.forEach(entry => {
        app.get(entry['link_from'], (req, res) => {
            res.redirect(entry['link_to']);
        });
    });
}


app.use('/static', express.static(__dirname + '/static'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/template/index.html');
});

app.post('/makeCrossRef', (req, res) => {
    let url_from = req.body.url_from;
    let url_to = req.body.url_to;

    (async () => {
        try {
            await client.query(`insert into links(link_from, link_to) values ('/${url_from}', '${url_to}')`);
            app.get(`/${url_from}`, (req, res) => {
                res.redirect(url_to);
            });
            return res.json({success: false, link: url_from});
        } catch(e) {
            console.error(e);
            return res.status(500).json({success: false});
        }
    })().catch(e => {
        console.error(e);
    });
});

app.listen(port, function () {
    console.log("Server running at http://localhost:%d", port);
});
