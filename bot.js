/**
 * Sous Chef Bot — Telegram Interface
 * Uses node-telegram-bot-api (polling mode). No LLM API required.
 * Rule-based engine lives entirely in ../shared/botEngine.js
 */

require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { getResponse, createSession } = require("./botEngine");

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!TOKEN) {
  console.error("❌  Missing TELEGRAM_BOT_TOKEN in .env");
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });

// Per-user session map (in-memory; resets on restart)
const sessions = new Map();

function getSession(userId) {
  if (!sessions.has(userId)) sessions.set(userId, createSession());
  return sessions.get(userId);
}

// Convert lightweight **bold** and *italic* markdown to Telegram MarkdownV2
function toMarkdownV2(text) {
  // Escape all MarkdownV2 reserved chars first, except the ones we handle
  const reserved = /([_\[\]()~`>#+\-=|{}.!\\])/g;
  // We'll do it manually in sections to keep **bold** and *italic* working
  return text
    .replace(/\*\*(.+?)\*\*/g, (_, m) => `*${m.replace(reserved, "\\$1")}*`)
    .replace(/\*(.+?)\*/g,     (_, m) => `_${m.replace(reserved, "\\$1")}_`)
    .replace(/_(.+?)_/g,       (_, m) => `_${m.replace(reserved, "\\$1")}_`)
    .replace(/(?<!\*|_)([_\[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}

// ── /start command ────────────────────────────────────────────────────────

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const session = getSession(msg.from.id);

  const keyboard = {
    reply_markup: {
      keyboard: [
        ["🍝 Chicken + Pasta recipe", "🧈 How to brown butter?"],
        ["🥛 Substitute for buttermilk", "🥩 How to sear meat?"],
        ["❓ What can you do?"]
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  };

  const welcome =
    "👋 Hey there\\! I'm *Sous Chef Bot*, your Smart Kitchen Assistant\\.\n\n" +
    "I can help you with:\n" +
    "• 🍽️ Recipe suggestions based on what's in your fridge\n" +
    "• 👨‍🍳 Step\\-by\\-step cooking technique guides\n" +
    "• 🔄 Ingredient substitutions \\& conversions\n\n" +
    "Use the menu below or just type your question\\!";

  bot.sendMessage(chatId, welcome, { parse_mode: "MarkdownV2", ...keyboard });
});

// ── /help command ─────────────────────────────────────────────────────────

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const session = getSession(msg.from.id);
  const response = getResponse("help", session);
  try {
    bot.sendMessage(chatId, toMarkdownV2(response.text), { parse_mode: "MarkdownV2" });
  } catch {
    bot.sendMessage(chatId, response.text);
  }
});

// ── All other messages ────────────────────────────────────────────────────

bot.on("message", (msg) => {
  // Skip commands (already handled above)
  if (msg.text && msg.text.startsWith("/")) return;

  const chatId  = msg.chat.id;
  const userId  = msg.from.id;
  const text    = msg.text || "";
  const session = getSession(userId);

  // Show "typing…" indicator
  bot.sendChatAction(chatId, "typing");

  // Small delay to feel natural
  setTimeout(() => {
    const response = getResponse(text, session);
    try {
      bot.sendMessage(chatId, toMarkdownV2(response.text), { parse_mode: "MarkdownV2" });
    } catch {
      // Fall back to plain text if MarkdownV2 escaping fails on edge-case input
      bot.sendMessage(chatId, response.text);
    }
  }, 600);
});

// ── Error handling ────────────────────────────────────────────────────────

bot.on("polling_error", (err) => {
  console.error("Polling error:", err.message);
});

console.log("✅  Sous Chef Bot is running on Telegram…");
