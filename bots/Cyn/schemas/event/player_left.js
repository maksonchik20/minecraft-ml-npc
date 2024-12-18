const { ajv } = require("../../../../modules/functions");

module.exports = ajv.compile({
    type: "object",
    properties: {
        type: {type: "string", pattern: "^event$"},
        event_type: {type: "string", pattern: "^player_left$"},
        player_name: {type: "string"}
    },
    additionalProperties: false,
    required: ["type", "event_type", "player_name"]
})