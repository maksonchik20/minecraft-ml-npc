const { ajv } = require("../../../modules/functions");

module.exports = ajv.compile({
    type: 'array',
    items: {
        type: 'object',
        properties: {
            functionCall: {
                type: 'object',
                properties: {
                    name: {type: "string"}
                },
                required: ["name"]
            }
        },
        required: ['functionCall']
    }
})