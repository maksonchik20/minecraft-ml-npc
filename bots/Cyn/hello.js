function add(console, bot) {
    bot.once('spawn', async () => {
        let messages = [
            {
                role: 'system',
                text: bot.config.startPrompt
            }
        ]
        let res = await bot.behaviors.gpt.ask(messages);
        bot.chat(res.result.alternatives[0].message.text)
        
        console.log('Hello hello!')
    })
}

module.exports = add