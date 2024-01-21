import { API_CONSTANTS } from "grammy";
import { createBot } from "./bot/index.js";
import { createServer } from "./server/index.js";

const bot = createBot(process.env.BOT_TOKEN as string);
// const server = await createServer(bot);

// await server.listen(3009)

// if(process.env.NODE_ENV === 'production'){
//   await bot.init();
//   await bot.api.setWebhook(`https://match.iswebdev.ru/${process.env.BOT_TOKEN as string}`, {
//       allowed_updates: API_CONSTANTS.ALL_UPDATE_TYPES,
//     })

// }


/**
 * Раскоментировать если не используется @grammyjs/runner
 */
bot.start();
