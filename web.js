var express = require('express');
var app = express();
var fs = require('fs');

var GoogleSpreadsheet = require('google-spreadsheet');

function spreadsheetAddRow(data) {
    //필수컬럼. botuserkey	name	phone	birthdate	updatetime
    var doc = new GoogleSpreadsheet('1jteIm8usJhx5RoBdmklsTrn0KI-q2sXsgEoOb8LL9Mk'); //songaal
    var creds = require('./client_secret.json');
    
    doc.useServiceAccountAuth(creds, function (err) {
        
        found = false;
        doc.getRows(worksheet_id = 1, {
                offset: 1, 
                limit: 1,
                query: 'botuserkey = ' + data.botuserkey
            }, 
            function (err, rows) {
                // console.log("rows : ", rows);
                if (err) {
                    console.log(err);
                    return;
                }
                if(rows[0]) {
                    rows[0].name = data.name;
                    rows[0].phone = data.phone;
                    rows[0].birthdate = data.birthdate;
                    rows[0].updatetime= new Date();
                    rows[0].save();
                    found = true;
                } else {
                     //신규추가.
                    doc.addRow(worksheet_id = 1, data, function (err, row) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            }
        );
    });
}
function main() {
    app.use(express.json());
    app.get('/', function(req, res) {
        res.json({
            'message':'Welcome to Skill API!'
        });
    });

    app.post('/test', function(req, res) {
        if (req.body) {
            res.status(200);
            res.json(req.body);
        }
    });

    app.post('/users', function(req, res) {
        let data = { text: 'OK' };
        console.log('------------ POST BODY -----------');
        console.log(req.body);
        let result = true;
        if (req.body) {
            //디비에 저장.
            const data  = {
                botuserkey: req.body.userRequest.user.id,
                name: req.body.action.params.name,
                phone: "'" + req.body.phone,
                birthdate: req.body.action.params.birthday.value,
                updatetime: new Date()
            };
            spreadsheetAddRow(data);
        }

        let text = '';
        if (result) {
            res.status(200);
            text = '입력성공';
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

    var server = app.listen(8002, '0.0.0.0', function() {
        var host = server.address().address;
        var port = server.address().port;
        console.log('Kakao Chatbot API listening at http://%s:%s', host, port);
    });
}

main();