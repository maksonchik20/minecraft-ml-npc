const {query} = require('./ygpt.js')
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function joke(console, bot)
{
    while (1)
    {
        query();
        await sleep(10000)
    }
}
module.exports = joke
