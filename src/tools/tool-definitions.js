const tools = [
  {
    type: "function",
    name: "get_weather",
    description:
      "Get current weather for a supported city.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        city: {
          type: "string",
          enum: ["Nagpur", "Pune", "Mumbai", "Delhi"]
        }
      },
      required: ["city"],
      additionalProperties: false
    }
  }
];

module.exports = { tools };