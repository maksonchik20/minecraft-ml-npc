const fs = require('fs/promises')
let filepath = './gptdata.json'
async function initgpt ()
{
    let data = {
        'modelUri':'gpt://b1glpqm6du4km50rq59p/yandexgpt/latest',
        'completionOptions':{'stream': false,
        'temperature': 1,
        'maxTokens': 1000},
        'messages':[
        {
            role:'system',
            text:'рассказывай шутки'
        },
        {
            role:'user',
            text:'привет'
        }
        ]        
    }
    await fs.writeFile('./bots/Amebka/gptdata.json', JSON.stringify(data))
}
async function query() {

    const url = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion'
    let GPT_TOKEN="t1.9euelZqck5nKns-UiZ2ax8yXm8iKme3rnpWaz82RzJeZipCZlJ3PlpTGzo3l8_cIAm5E-e9TFFNv_t3z90gwa0T571MUU2_-zef1656VmovLzZeckoqSlYmZmo3Oxp7M7_zN5_XrnpWaiZWSxpeLipOTzpOTjZaQj8rv_cXrnpWai8vNl5ySipKViZmajc7Gnsw.8_bwRE-afzNPQXAMukHL4UcqJ6oFztV0toAMtvpqNcf8G9Jw_io11FAHrozuQTeLLsgQEvffNu3Tm1G4r7DKCQ"

    const headers = {
        'Authorization': 'Bearer ' + GPT_TOKEN
    }
    let jsondata = await fs.readFile("./bots/Amebka/gptdata.json", "utf8")
    console.log(jsondata)
    let responce = await fetch(url, {
        method:"POST",
        headers:headers,
        body:jsondata
    })
    let ss = await responce.json()
    let resp = JSON.stringify(ss)
    return ss.result.alternatives[0].message.text
}
module.exports = {initgpt, query};
