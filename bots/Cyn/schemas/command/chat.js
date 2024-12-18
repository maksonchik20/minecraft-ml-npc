const { ajv } = require("../../../../modules/functions");

module.exports = {
    validator: ajv.compile({
        type: "object",
        properties: {
            name: {type: "string", pattern: "^chat$"},
            arguments: {
                type: "object",
                properties: {
                    message: {type: "string", minLength: 1}
                },
                additionalProperties: false,
                required: ["message"]
            }
        },
        additionalProperties: false,
        required: ["name", "arguments"]
    }),
    tool: {
        function: {
            name: 'chat',
            description: 'Написать сообщение в чат',
            parameters: {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string',
                        'description': 'Сообщение, которое нужно написать в чат'
                    }
                }
            }
        }
    },
    execute: (bot, arguments) => {

    }
}