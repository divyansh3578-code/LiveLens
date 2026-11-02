
const { randomUUID } = require("crypto");
const { askAssistant } = require("../services/agent.service");
const Conversation = require("../models/Conversation");

async function chat(req, res, next) {
  try {
    const { question, conversationId } = req.body;

    if (
      typeof question !== "string" ||
      question.trim().length === 0 ||
      question.length > 2000
    ) {
      return res.status(400).json({
        success: false,
        error: "Enter a question of up to 2000 characters.",
      });
    }

    if (
      conversationId !== undefined &&
      (typeof conversationId !== "string" ||
        conversationId.length > 100 ||
        !conversationId.trim())
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid conversationId.",
      });
    }

    const id = conversationId || randomUUID();

    let conversation = await Conversation.findOne({
      conversationId: id,
    });

    if (!conversation) {
      conversation = new Conversation({
        conversationId: id,
        messages: [],
      });
    }

    // Use only recent messages to limit prompt size.
    const history = conversation.messages
      .slice(-10)
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));

    const cleanQuestion = question.trim();

    // Generate an answer using the existing tools and chat history.
    const result = await askAssistant(cleanQuestion, history);

    // Save the current turn after the assistant responds successfully.
    conversation.messages.push(
      {
        role: "user",
        content: cleanQuestion,
      },
      {
        role: "assistant",
        content: result.answer,
      }
    );

    await conversation.save();

    res.json({
      success: true,
      conversationId: id,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { chat };
