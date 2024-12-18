const { ajv } = require("../../../../modules/functions");

module.exports = ajv.compile({
    type: "object",
    properties: {
        type: {type: "string", pattern: "^event$"},
        event_type: {type: "string", pattern: "^bot_joined$"}
    },
    additionalProperties: false,
    required: ["type", "event_type"]
})