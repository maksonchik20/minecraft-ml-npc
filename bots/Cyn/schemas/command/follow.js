const { ajv } = require("../../../../modules/functions");

module.exports = ajv.compile({
    type: "object",
    properties: {
        type: {type: "string", pattern: "^command$"},
        command_type: {type: "string", pattern: "^follow$"},
        player_name: {type: "string"}
    },
    additionalProperties: false,
    required: ["type", "command_type", "player_name"]
})