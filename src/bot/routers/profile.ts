import { Router } from "@grammyjs/router";
import { CustomContext } from "../types/CustomContext.js";
import { keyboardAge, keyboardReturn } from "../keyboards/index.js";

const router = new Router<CustomContext>((ctx) => ctx.session.route);

const profile = router.route("profile");

profile.on("msg:text", async (ctx) => {
  if (ctx.msg.text === "1") {
    await ctx.reply("Сколько тебе лет?", {
      reply_markup: ctx.session.myProfile ? keyboardAge(ctx) : undefined,
    });
    ctx.session.route = "fillProfileAge";
  } else if (ctx.msg.text === "2") {
    ctx.session.route = 'updateProfileMedia'
    await ctx.reply(
      `Теперь пришли фото или запиши видео 👍 (до 15 сек)`,
      {
        reply_markup: keyboardReturn
      },
    );
  } else if (ctx.msg.text === "3") {
    ctx.session.route = 'updateProfileDescription'
    await ctx.reply(
      `Расскажи о себе и кого хочешь найти, чем предлагаешь заняться. Это поможет лучше подобрать тебе компанию.`,
      {
        reply_markup: keyboardReturn,
      },
    );
  } else if (ctx.msg.text === "4") {
    await ctx.reply("4");
  }
});

export { router };
