const { sleep } = require("../../../modules/functions");

module.exports = {
    validator: (text='') => {
        if(text.split(/[\t\n\r ]/).length < 2)
            return false;
        return true;
    },
    execute: async (bot, text) => {
        let lines = text.split(/[\n]/)
        let nlines = []
        lines.forEach((line) => {
            let words = line.split(/[ ]/)
            let nline = ''
            words.forEach((word) => {
                if(nline.length + word.length + 1 < 250) {
                    nline += ` ${word}`
                } else if(word.length > 250) {
                    for(let i = 0; i<word.length; i += 250) {
                        nline = word.substring(i, Math.min(i + 250, word.length))
                        if(nline == 250) {
                            nlines.push(nline.trim())
                            nline = ''
                        }
                    }
                } else {
                    nlines.push(nline.trim())
                    nline = word
                }
            })
            if(nline != '')
                nlines.push(nline)
        })
        let promises = []
        let lst = 0
        nlines.forEach((nline) => {
            let func = async () => {
                lst += 100 + Math.random() * 100
                await sleep(lst)
                bot.chat(nline)
            }
            promises.push(func())
        })
        await Promise.all(promises)
        bot.behaviors.eventPool.addEvent('Команда', '"CHAT" успешно выполнена');
    }
}