const GoogleSpreadsheet = require('google-spreadsheet');
const {promisify} = require("es6-promisify");

exports.handler = async (event) => {

    const birthday = JSON.parse(event.action.params.birthday);
    const data  = {
        botuserkey: event.userRequest.user.id,
        name: event.action.params.name,
        phone: event.action.params.phone,
        birthdate: birthday.value,
        updatetime: new Date().toISOString(),
    };
    // try {
    await spreadsheetAddRow(data);
    // } catch (err) {
    //     console.log("err> ", err);
    // }
    const response = {
        statusCode: 200,
        data: data
    };
    return response;
};

async function spreadsheetAddRow(data) {
    //필수컬럼. botuserkey	name	phone	birthdate	updatetime
    var doc = new GoogleSpreadsheet('1jteIm8usJhx5RoBdmklsTrn0KI-q2sXsgEoOb8LL9Mk'); //songaal
    var creds = require('./client_secret.json');
    const useServiceAccountAuth = promisify(doc.useServiceAccountAuth);
    const getRows = promisify(doc.getRows);
    const addRow = promisify(doc.addRow);
    console.log(new Date().toISOString(), " ### 1 Login.");
    await useServiceAccountAuth(creds);
    console.log(new Date().toISOString(), " ### 2 Get Row.");
    let rows = await getRows(worksheet_id = 1, {
        offset: 1,
        limit: 1,
        query: 'botuserkey = ' + data.botuserkey
    });
    console.log("rows[0] >> ", rows[0])
    if (rows[0]) {
        console.log(new Date().toISOString(), " ### 3 UPDATE >> ", data.name);
        rows[0].name = data.name;
        rows[0].phone = data.phone;
        rows[0].birthdate = data.birthdate;
        rows[0].updatetime = data.updatetime;
        const saveRow = function (row) {
            return new Promise(function(resolve, reject){
                row.save(function(err){
                    if(err) reject(err)
                    resolve();
                });
            });
        }
        await saveRow(rows[0]);
        console.log(new Date().toISOString(), " ### 3 Done >> ", JSON.stringify(data));
    } else {
        console.log(new Date().toISOString(), " ### 3 NEW >> ", data.name);
        //신규추가.
        await addRow(worksheet_id = 1, data);
        console.log(new Date().toISOString(), " ### 3 Done >> ", JSON.stringify(data));
    }
}