var GoogleSpreadsheet = require('google-spreadsheet');

// var doc = new GoogleSpreadsheet('1RMuj-yQRcIC2bZTad3B0k8JUSlc38mQPi8aqzmtVZY4');
// var creds = require('./newagent-19dd9-cdae6620cc72.json');

var doc = new GoogleSpreadsheet('11ADL4V7mWkHoPQTX-lGM1TpWoBP1KtMSU7p4yyj3uYI');
var creds = require('./HLW-4a5e7806b514.json');

// Authentication
// function addRow(data) {
exports.addRow = function(data) {
    doc.useServiceAccountAuth(creds, function (err) {

        doc.addRow(worksheet_id = 1, data, function (err, row) {
            if (err) {
                console.log(err);
            }
        });
    });
}

//TEST
// let data = { name: "홍길동", phone: '010-3456-1234', email: 'hong@gmail.com', brand: '', bot_user_key: '1234567890' };
// addRow(data);