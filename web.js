var express = require('express');
var app = express();
var fs = require('fs');
const request = require('request');
const mysql = require('mysql');
const spreadsheet_api = require('./spreadsheet_api');

const rest_api_key = 'd9a21c5df877ef382d5826d56be2e693';
const success_message = '감사합니다. 좋은정보로 연락드리겠습니다.';

function main() {
    app.use(express.json());
    app.get('/', function(req, res) {
        res.json({
            'message':'Welcome to HLW skill API!'
        });
    });

    app.post('/users', function(req, res) {
        let data = { text: 'OK' };
        console.log('------------ POST BODY -----------');
        console.log(req.body);
        let result = false;
        if (req.body) {
            let bot_user_key = req.body.userRequest.user.id;
            let contexts = req.body.contexts;
            let brand = '';
            if (contexts.length > 0) {
                console.log(contexts[0].params);
                //TOOD contexts 를 돌면서 name==Output 인걸 찾고.
                brand = contexts[0].params.brand.value;
            }
            let str = req.body.action.params.myprofile;
            let url = JSON.parse(str).otp;
            console.log('URL >> ', url);

            const options = {
                uri: url,
                qs: {
                    rest_api_key: rest_api_key
                }
            };
            request(options, function(err, response, body) {
                let profile = JSON.parse(body);
                console.log('bot_user_key> ', bot_user_key);
                console.log('브랜드> ', brand);
                console.log('닉네임> ', profile.nickname);
                console.log('전화번호> ', profile.phone_number);
                console.log('이메일> ', profile.email);

                //디비에 저장.
                const data  = {
                    name: profile.nickname,
                    phone: "'" + profile.phone_number,
                    email: profile.email,
                    brand: brand,
                    bot_user_key: bot_user_key
                };
                // insert_db(data);
                spreadsheet_api.addRow(data);
            });
            result = true;
        }

        let text = '';
        if (result) {
            res.status(200);
            text = success_message;
        } else {
            text = '에러가 발생했습니다.';
        }
        res.json({
            version: '2.0',
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: text
                        }
                    }
                ]
            }
        });
    });

    var server = app.listen(8001, function() {
        var host = server.address().address;
        var port = server.address().port;
        console.log('Kakao Chatbot API listening at http://%s:%s', host, port);
    });
}

function insert_db(data) {
    // 비밀번호는 별도의 파일로 분리해서 버전관리에 포함시키지 않아야 합니다.
    const connection = mysql.createConnection({
        host     : 'eth-mainnet',
        user     : 'gncloud',
        password : 'gncloud1@',
        database : 'new_schema'
    });

    connection.connect();

    const query = connection.query('INSERT INTO users SET ?', data, function (error, results, fields) {
        if (error) throw error;
        // Neat!
    });

    connection.end();
}

main();