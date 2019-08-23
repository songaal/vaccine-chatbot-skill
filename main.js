const express = require('express');
const user = require('./addUser');
const vaccine = require('./getVaccine');
const app = express();

async function main() {
    app.use(express.json());

    app.get('/', function (req, res) {
        res.json({
            'message': 'Welcome to Skill API!'
        });
    });

    app.post('/test', function (req, res) {
        if (req.body) {
            res.status(200);
            res.json(req.body);
        }
    });

    app.post('/users', async function (req, res) {
        // console.log('------------ POST BODY -----------');
        // console.log(req.body);
        let data;
        if (req.body) {
            data = await user.handler(req.body);
        }
        res.status(200);
        res.json(data);
    });

    app.post('/vaccine', async function (req, res) {
        let data;
        if (req.body) {
            data = await vaccine.handler(req.body);
        }
        res.status(200);
        res.json(data);
    });

    var server = app.listen(8002, '0.0.0.0', function () {
        var host = server.address().address;
        var port = server.address().port;
        console.log('Kakao Chatbot API listening at http://%s:%s', host, port);
    });
}

/*1. */
// main().then(result => {
//     console.log('result:', result);
// }).catch(error => {
//    console.log('error:', error);
// });

/*2. */
(async function() {
    await main()
})();