const { mineflayer: mineflayerViewer } = require('prismarine-viewer')
async function startviewserver(console, bot) 
{
    bot.once('spawn', () => {
        mineflayerViewer(bot, {host:3000, firstPerson:false})
    })
}
module.exports = startviewserver