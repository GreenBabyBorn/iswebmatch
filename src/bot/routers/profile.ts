import { Router } from "@grammyjs/router";
import { CustomContext } from "../types/CustomContext.js";
import { keyboardAge, keyboardRate, keyboardReturn } from "../keyboards/index.js";
import { prisma } from "../prisma/index.js";
import { showProfile } from "../composers/index.js";

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
    await ctx.reply("✨🔍", {
      reply_markup: keyboardRate
    });

    await startShowProfile(ctx)
  }
});

const startShowProfile = async (ctx: CustomContext) => {
  if (!ctx.session.profiles![0]) {
    ctx.session.profiles = await prisma.profile.findMany({
      take: 1,
      where: {
        platformId: {
          not: ctx.from?.id.toString() as string
        },
        sex:
          ctx.session.myProfile?.interest === 3
            ? undefined
            : ctx.session.myProfile?.interest,

      },
    });
  }
  await showProfile(ctx, ctx.session.profiles![0], true)

  ctx.session.route = "showNewProfiles"
}

export { router, startShowProfile };
