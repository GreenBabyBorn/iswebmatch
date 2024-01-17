import { createBot } from "./bot/index.js";
// import { run } from "@grammyjs/runner";
const bot = createBot(process.env.BOT_TOKEN);
// const server = await createServer(bot);
// await server.listen(3009)
// if(process.env.NODE_ENV === 'production'){
//   await bot.init();
//   await bot.api.setWebhook(`https://match.iswebdev.ru/${process.env.BOT_TOKEN as string}`, {
//       allowed_updates: API_CONSTANTS.ALL_UPDATE_TYPES,
//     })
// }
bot.start();
