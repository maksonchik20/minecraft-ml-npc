function add(console, bot) {
    bot.once('spawn', async () => {
        bot.behaviors.eventPool.addEvent('Бот', `Ты зашёл на сервер`)
        
        console.log('Hello hello!')
    })

    bot.removeAllListeners('chat')

    bot.on('chat', (username, message) => {
        if(username == bot.username) return;
        if (message.includes(bot.username) && bot.players[username].entity) {
            setTimeout(() => {
                addInterest(bot.players[username].entity)
            }, Math.random() * 100)
        }
        if((message.includes(bot.username) || bot.behaviors.interest.isEntityIntrested(bot.players[username].entity)))
            bot.behaviors.eventPool.addEvent(`Чат`, `Игрок "${username}" отправил сообщение "${message}"`);
    })

    bot.on('playerJoined', (player) => {
        if(player.username == bot.username) return;
        bot.behaviors.eventPool.addEvent(`Игрок`, `Игрок "${player.username}" зашёл на сервер`);
    })

    bot.on('playerLeft', (player) => {
        if(player.username == bot.username) return;
        bot.behaviors.eventPool.addEvent(`Игрок`, `Игрок "${player.username}" вышел с сервера`);
    })

    bot.on('entityHurt', (entity) => {
        console.log(entity.type + ' damaged!')
        switch (entity.type) {
            case 'player':
                if(entity.username == bot.username) {
                    bot.behaviors.eventPool.addEvent('Сущность', `Бот получил урон`);
                } else {
                    bot.behaviors.eventPool.addEvent('Сущность', `Игрок "${entity.username}" получил урон`);
                }
                break;
            case 'animal':
                bot.behaviors.eventPool.addEvent('Сущность', `Животное "${entity.name}" получил урон`);
                break;
            case 'hostile':
                bot.behaviors.eventPool.addEvent('Сущность', `Враждебная сущность "${entity.name}" получил урон`);
                break;
            default:
                bot.behaviors.eventPool.addEvent('Сущность', `Cущность "${entity.name}" получил урон`);
                break;
        }
    })

    bot.on('entitySwingArm', (entity) => {
        console.log(entity.type + ' swinged arm!')
        switch (entity.type) {
            case 'player':
                if(entity.username == bot.username) {
                    bot.behaviors.eventPool.addEvent('Сущность', `Бот замахнулся рукой`);
                } else {
                    bot.behaviors.eventPool.addEvent('Сущность', `Игрок "${entity.username}" замахнулся рукой`);
                }
                break;
            case 'animal':
                bot.behaviors.eventPool.addEvent('Сущность', `Животное "${entity.name}" замахнулся рукой`);
                break;
            case 'hostile':
                bot.behaviors.eventPool.addEvent('Сущность', `Враждебная сущность "${entity.name}" замахнулся рукой`);
                break;
            default:
                bot.behaviors.eventPool.addEvent('Сущность', `Cущность "${entity.name}" замахнулся рукой`);
                break;
        }
    })

    bot.on('startedAttacking', () => {
        bot.behaviors.fighting = true;
    })

    bot.on('stoppedAttacking', () => {
        bot.behaviors.fighting = false;
    })
}

module.exports = add