import "dotenv/config";
import {
  Api,
  Bot,
  Context,
  GrammyError,
  HttpError,
  session,
  BotConfig,
} from "grammy";
import { FileApiFlavor, FileFlavor, hydrateFiles } from "@grammyjs/files";
import { PrismaAdapter } from "@grammyjs/storage-prisma";
import { run, sequentialize } from "@grammyjs/runner";
import { composer } from "./composers/index.js";
import { CustomContext } from "./types/CustomContext.js";
import { SessionData } from "./types/SessionData.js";
import { prisma } from "./prisma/index.js";
import { router as profile } from "./routers/profile.js";
import { router as fillProfile } from "./routers/fillProfile.js";
import { router as showProfiles } from "./routers/showProfiles.js";
import { router as matches } from "./routers/matches.js";

type Options = {
  config?: Omit<BotConfig<Context>, "ContextConstructor">;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function createBot(token: string, options: Options = {}) {
  const bot = new Bot<CustomContext, FileApiFlavor<Api>>(token, {
    // client: {
    //     canUseWebhookReply: (method) => method === "sendChatAction",
    // },
  });

  /**
   * Функция для инициализации сессии
   */
  function initial(): SessionData {
    return {
      myProfile: {
        id: 0,
        published: true,
        name: "",
        media: "",
        age: 0,
        description: "",
        city: "",
        sex: 0,
        interest: 0,
        platformId: "",
        platformName: "tg",
      },
      activeMatchProfile: [],
      route: "idle",
    };
  }

  function getSessionKey(ctx: Context): string | undefined {
    return ctx.from?.id.toString();
  }

  /**
   * * Выполните упорядочивание перед доступом к данным сеанса
   */
  // bot.use(sequentialize(getSessionKey));

  bot.use(
    session({
      initial,
      getSessionKey,
      storage: new PrismaAdapter<SessionData>(prisma.session),
    })
  );

  bot.use(composer);

  /**
   * Подключение роутеров
   */
  bot.use(matches);
  bot.use(profile);
  bot.use(fillProfile);
  bot.use(showProfiles);

  /**
   * Перехватчик ошибок
   */
  bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Ошибка при обработке обновления: ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
      console.error("Ошибка в запросе:", e.description);
    } else if (e instanceof HttpError) {
      console.error("Не удалось связаться с Telegram:", e);
    } else {
      console.error("Неизвестная ошибка:", e);
    }
  });

  // const runner = run(bot);

  process.once("SIGINT", async () => {
    // await runner.stop()
    await bot.stop();
  });
  process.once("SIGTERM", async () => {
    // await runner.stop()
    await bot.stop();
  });

  return bot;
}

export type CreateBot = ReturnType<typeof createBot>;
