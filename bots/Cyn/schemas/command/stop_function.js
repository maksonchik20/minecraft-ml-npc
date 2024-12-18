const { ajv } = require("../../../../modules/functions");

module.exports = {
    validator: ajv.compile({
        type: "object",
        properties: {
            name: {type: "string", pattern: "^stop_function$"},
            arguments: {
                type: "object",
                additionalProperties: false
            }
        },
        additionalProperties: false,
        required: ["name", "arguments"]
    }),
    tool: {
        function: {
            name: 'stop_function',
            description: 'Остановиться в выполнениях функций',
            parameters: {
                'type': 'object',
                'properties': { }
            }
        }
    },
    execute: (bot, arguments) => {

    }
}