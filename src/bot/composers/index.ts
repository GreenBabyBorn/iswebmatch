import { Composer } from "grammy";
import { CustomContext } from "../types/CustomContext.js";
import EventEmitter from "events";
import { prisma } from "../prisma/index.js";
import { keyboardProfile } from "../keyboards/index.js";
import { Profile } from "@prisma/client";

const composer = new Composer<CustomContext>();

export const showProfile = async (ctx: CustomContext, profile: Profile) => {
  const getMedia = await ctx.api.getFile(
    profile.media as string,
  );
  const isVideoMedia = (getMedia.file_path as string).includes("videos");
  await ctx[isVideoMedia ? "replyWithVideo" : "replyWithPhoto"](
    profile.media as string,
    {
      caption: `${profile.name}, ${profile.age}, ${profile.city
        } ${profile.description
          ? "- " + profile.description
          : ""
        }`,
    },
  );
};

export const main = async (ctx: CustomContext) => {
  const profile = await prisma.profile.findFirst({
    where: {
      platformId: ctx.from?.id.toString(),
      platformName: "tg",
    },
  });
  if (!profile) {
    await ctx.reply("Сколько тебе лет?", {
      reply_markup: { remove_keyboard: true },
    });
    ctx.session.route = "fillProfileAge";
    return;
  }

  ctx.session.myProfile = profile;


  await ctx.reply("Ваша анкета:");
  await showProfile(ctx, ctx.session.myProfile!);
  await ctx.reply(
    "1. Заполнить анкету заново. \n2. Изменить фото/видео. \n3. Изменить текст анкеты. \n4. Смотреть анкеты.",
    { reply_markup: keyboardProfile },
  );
  ctx.session.route = "profile";
};

const emitter = new EventEmitter();

composer.command("start", async (ctx) => {
  await main(ctx);
});

composer.command("myprofile", async (ctx) => {
  await main(ctx);
});

/**
 * * Мидлвар в котором запускаем слушатель события (у каждого пользователя может быть запущен только один слушатель)
 */
composer.use(async (ctx, next) => {
  if (!emitter.eventNames().includes(ctx.from?.id.toString() as string)) {
    emitter.on(ctx.from?.id.toString() as string, async (args) => {
      console.log(args, ctx.session.myProfile!.platformId, ctx.from?.id);
      if (args === ctx.session.myProfile!.platformId) {
        let matches = await prisma.match.findMany({
          where: {
            toId: ctx.session.myProfile!.platformId.toString()
          },
          include: {
            from: {
              select: {
                name: true,
                sex: true,
                age: true,
                interest: true,
                description: true,
                city: true,
                media: true,
                platformId: true,
                published: true
              }
            }
          }

        })
        // console.log(matches)
        let matchText = ''
        let matchWhoText = ''
        if (ctx.session.myProfile.interest === 0 && matches.length > 1) matchText = 'девушкам', matchWhoText = 'их'
        else if (ctx.session.myProfile.interest === 0) matchText = 'девушке', matchWhoText = 'её'
        if (ctx.session.myProfile.interest === 1 && matches.length > 1) matchText = 'парням', matchWhoText = 'их'
        else if (ctx.session.myProfile.interest === 1) matchText = 'парню', matchWhoText = 'его'
        await ctx.reply(`Ты ${ctx.session.myProfile.sex ? 'понравился' : 'понравилась'} ${matches.length} ${matchText}, показать ${matchWhoText}?
        \n1. Показать.\n2. Не хочу больше никого смотреть.`)
        ctx.session.route = 'showMatchesProfiles'
        // await ctx.reply(`Отлично! Надеюсь хорошо проведете время ;) Начинай общаться 👉 <a href="${`tg://user?id=${ctx.session.myProfile.platformId}`}">${ctx.session.myProfile.name}</a>`, {
        //   parse_mode: "HTML", link_preview_options: {
        //     is_disabled: true
        //   }
        // })

      }
    });
  }
  // console.log(emitter.eventNames().includes(ctx.from?.id.toString() as string))
  // console.log(emitter.listeners(ctx.from?.id.toString() as string));
  await next()
})


composer.command("test", async (ctx) => {
  const profiles = await prisma.profile.findMany({

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
  console.log(profiles)
});

// router.otherwise(async (ctx)=>{
//     await ctx.reply("Нет такого варианта ответа")
// })

export { composer, emitter };
