import { Router } from "@grammyjs/router";
import { CustomContext } from "../types/CustomContext.js";
import { keyboardAge } from "../keyboards/index.js";

const router = new Router<CustomContext>((ctx) => ctx.session.route);

const profile = router.route("profile");

profile.on("msg:text", async (ctx) => {
  if (ctx.msg.text === "1") {
    await ctx.reply("Сколько тебе лет?", {
      reply_markup: ctx.session.myProfile ? keyboardAge(ctx) : undefined,
    });
    ctx.session.route = "fillProfileAge";
  } else if (ctx.msg.text === "2") {
    await ctx.reply("22222");
  } else if (ctx.msg.text === "3") {
    await ctx.reply("3");
  } else if (ctx.msg.text === "4") {
    await ctx.reply("4");
  }
});

export { router };
