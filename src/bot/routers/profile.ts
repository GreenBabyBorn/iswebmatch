import { Router } from "@grammyjs/router";
import { CustomContext } from "../types/CustomContext.js";
import { keyboardAge, keyboardRate, keyboardReturn } from "../keyboards/index.js";
import { prisma } from "../prisma/index.js";
import { emitter } from "../composers/index.js";


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
    if (!ctx.session.shownProfile) ctx.session.shownProfile = 0
    if (!emitter.eventNames().includes(ctx.from?.id.toString() as string)) {
      emitter.on(ctx.from?.id.toString() as string, async (args) => {
        // console.log(args, ctx.session.myProfile!.platformId, ctx.from?.id);
        if (args === ctx.session.myProfile!.platformId) {
          await ctx.reply(`Отлично! Надеюсь хорошо проведете время ;) Начинай общаться 👉 <a href="tg://user?id=${ctx.from?.id}">${ctx.from?.first_name}</a>`, { parse_mode: "HTML",link_preview_options:{
            is_disabled: true
          } })

        }
      });
    }
    
    console.log(emitter.eventNames().includes(ctx.from?.id.toString() as string))
    console.log(emitter.listeners(ctx.from?.id.toString() as string));
    await ctx.reply("✨🔍", {
      reply_markup: keyboardRate
    });

    await startShowProfile(ctx)
  }
});

const startShowProfile = async (ctx: CustomContext) => {
  ctx.session.profiles = await prisma.profile.findMany({

    where: {
      platformId: {
        not: ctx.from?.id.toString() as string
      },
      // NOT: {
      //   platformId: ctx.from?.id.toString()
      // },
      sex:
        ctx.session.myProfile?.interest === 3
          ? undefined
          : ctx.session.myProfile?.interest,

    },

  });
  const getMedia = await ctx.api.getFile(ctx.session.profiles![ctx.session.shownProfile!].media);
  const isVideoMedia = (getMedia.file_path as string).includes("videos");
  await ctx[isVideoMedia ? "replyWithVideo" : "replyWithPhoto"](
    ctx.session.profiles![ctx.session.shownProfile!].media,
    {
      reply_markup: keyboardRate,
      caption: `${ctx.session.profiles![ctx.session.shownProfile!].name}, ${ctx.session.profiles![ctx.session.shownProfile!].age
        }, ${ctx.session.profiles![ctx.session.shownProfile!].city}  ${ctx.session.profiles![ctx.session.shownProfile!].description
          ? "- " + ctx.session.profiles![ctx.session.shownProfile!].description
          : ""
        }`,
    }
  );
  ctx.session.route = "showNewProfiles"
}

export { router, startShowProfile };
