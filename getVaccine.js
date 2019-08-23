const GoogleSpreadsheet = require('google-spreadsheet');
const {promisify} = require("es6-promisify");
const VaccineData = require('./vaccine_data')

exports.handler = async (event) => {

    const user_key  = event.userRequest.user.id;
    const data = await getSpreadsheetRow(user_key);

    console.log('user_key > ', user_key);

    let response = {
        version: '2.0',
        template: {
            outputs: [
            ]
        }
    }
    if(data) {
        //설정있음. 찾아서 보여준다.
        let months = monthDiff(new Date(data.birthdate), new Date);
        let vaccine_data = getVaccine(months);
        let vaccine_content = '현재 필요한 예방접종은 없습니다.';
        if (vaccine_data) {
            vaccine_content = '필요한 예방접종은 아래와 같습니다.\n\n' + vaccine_data;
        }
        let block = {
            simpleText: {
                text: data.name + '님은 ' + months + '개월입니다.\n' + vaccine_content,
            }
        }
        response.template.outputs.push(block)
    } else {
        //설정없다. 설정버튼필요.
        let block = {
            simpleText: {
                text: '아직 설정이 안되어 있는 것 같아요.',
            }
        }
        response.template.outputs.push(block)
        //설정을 빠르게 시작하게 도와주는 바로가기 버튼을 하단에 보여준다.
        response.template.quickReplies = [
            {
                label: '설정시작하기',
                action: 'message',
                messageText: "설정"
            }
        ]
    }
    return response;
};

async function getSpreadsheetRow(user_key) {
    //필수컬럼. botuserkey	name	phone	birthdate	updatetime
    var doc = new GoogleSpreadsheet('1jteIm8usJhx5RoBdmklsTrn0KI-q2sXsgEoOb8LL9Mk'); //songaal
    var creds = require('./client_secret.json');
    const useServiceAccountAuth = promisify(doc.useServiceAccountAuth);
    const getRows = promisify(doc.getRows);
    console.log(new Date().toISOString(), " ### 1 Login.");
    await useServiceAccountAuth(creds);
    console.log(new Date().toISOString(), " ### 2 Get Row.");
    let rows = await getRows(worksheet_id = 1, {
        offset: 1,
        limit: 1,
        query: 'botuserkey = ' + user_key
    });
    console.log("rows[0] >> ", rows[0])
    return rows[0];
}

function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

function getVaccine(months) {
    if (months >= 12 * 12 && months < 13 * 12) {
        // 12세
        return VaccineData.data.y12;
    } else if (months >= 11 * 12 && months < 12 * 12) {
        // 11세
        return VaccineData.data.y11;
    } else if (months >= 6 * 12 && months < 7 * 12) {
        // Y6
        return VaccineData.data.y6;
    } else if (months >= 4 * 12 && months < 5 * 12) {
        // Y4
        return VaccineData.data.y4;
    } else if (months >= 24 && months <= 35) {
        // 24 ~ 35
        return VaccineData.data.m24;
    } else if (months >= 19 && months <= 23) {
        // 19 ~ 23
        return VaccineData.data.m19;
    } else if (months == 18) {
        // 18
        return VaccineData.data.m18;
    } else if (months == 15) {
        // 15
        return VaccineData.data.m15;
    } else if (months == 12) {
        // 12
        return VaccineData.data.m12;
    } else if (months == 6) {
        //6
        return VaccineData.data.m6;
    } else if (months == 4) {
        //4
        return VaccineData.data.m4;
    } else if (months == 2) {
        // 2
        return VaccineData.data.m2;
    } else if (months == 1) {
        // 1
        return VaccineData.data.m1;
    } else if (months == 0) {
        // <1
        return VaccineData.data.m0;
    }
}