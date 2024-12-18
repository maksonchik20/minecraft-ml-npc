const { ajv } = require("../../../../modules/functions");

module.exports = ajv.compile({
    type: "object",
    properties: {
        type: {type: "string", pattern: "^event$"},
        event_type: {type: "string", pattern: "^chat$"},
        player_name: {type: "string"},
        message: {type: "string", minLength: 1}
    },
    additionalProperties: false,
    required: ["type", "event_type", "message", "player_name"]
})