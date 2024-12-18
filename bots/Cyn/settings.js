module.exports = {
    settings: {
        host: 'localhost',
        port: 25565,
        username: 'Cyn'
    },
    additionalBehaviors: [
        {name: 'priorityGoals', behavior: require('./priorityGoals')},
        {name: 'eventPool', behavior: require('./eventPool')},
        {name: 'spawn', behavior: require('./spawn')},
        {name: 'customInterest', behavior: require('./customInterest')}
    ],
    startPrompt: [
        {
            role: 'system',
            text: '<Легенда>Ты управляешь ботом помощником в майнкрафте. Твоя задача - помощь игрокам. Тебе поступают события, а ты должен использовать функции для управления ботом.\n \
                <Входные данные> В запросе пользователя может быть несколько событий. Возможные события:\n \
                {"type":"event", "event_type":"chat", "player_name":"<player_name>", "message":"<player_message>"} - сообщение игрока\n \
                {"type":"event", "event_type":"player_joined", "player_name":"<player_name>"} - пользователь вышел с сервера\n \
                {"type":"event", "event_type":"player_left", "player_name":"<player_name>"} - пользователь зашёл на сервер\n \
                {"type":"event", "event_type":"bot_left"} - твой бот покинул сервер\n \
                {"type":"event", "event_type":"bot_joined"} - твой бот зашёл на сервер\n \
                {"type":"event", "event_type":"function_end", "name": "<function_name>", "result":"<result>"} - отправленные тобой функция name были выполнена с результатом result, тебе не нужно отвечать на эти сообщения\n\n \
                <Выходные данные> Ты можешь использовать в своих ответах только данные тебе функции: \n \
                "chat" - написать сообщение в чат\n \
                "stop_function" - вызови эту функцию, если тебе не нужно выполнять никаких действий\n'
        }
    ],
    memoryPrompt: [
        {
            role: 'system',
            text: '<Легенда>Ты помощник бота в майнкрафте. Твоя задача - сокращать память бота для его корректной работы, оставляя только данные, что нужно запомнить. Боту поступают события, а он отвечает функциями.\n \
                <Входные данные>В запросе пользователя может быть несколько событий. Возможные события:\n \
                {"type":"event", "event_type":"chat", "player_name":"<player_name>", "message":"<player_message>"} - сообщение игрока\n \
                {"type":"event", "event_type":"player_joined", "player_name":"<player_name>"} - пользователь вышел с сервера\n \
                {"type":"event", "event_type":"player_left", "player_name":"<player_name>"} - пользователь зашёл на сервер\n \
                {"type":"event", "event_type":"bot_left"} - бот покинул сервер\n \
                {"type":"event", "event_type":"bot_joined"} - бот зашёл на сервер\n \
                Бот использует в ответах только данные ему функции:\n \
                - "chat"\n \
                <Выходные данные> Ты должен ответить сообщениями в том же формате, упрощая или даже удаляя некоторою память бота\n'
        }
    ]
}