import { Router } from "@grammyjs/router";
import { CustomContext } from "../types/CustomContext.js";
import {
  keyboardChooseMatch,
  keyboardPause,
  keyboardProfile,
  keyboardRate,
} from "../keyboards/index.js";
import { showProfile } from "../composers/index.js";
import { prisma } from "../prisma/index.js";
import { startShowProfile } from "./profile.js";

const router = new Router<CustomContext>((ctx) => {
  return ctx.session.route;
});

const showNewProfiles = router.route("showNewProfiles");

showNewProfiles.on("msg:text", async (ctx) => {
  if (ctx.msg.text === "💤") {
    await ctx.reply("Подождем пока кто-то увидит твою анкету");
    await ctx.reply(
      "1. Смотреть анкеты. \n2. Моя анкета. \n3. Я больше не хочу никого искать.",
      { reply_markup: keyboardPause }
    );
    ctx.session.route = "pauseShow";
  } else if (ctx.msg.text === "👎") {
    ctx.session.profiles = await prisma.profile.findMany({
      take: 1,
      skip: 1,
      cursor: {
        platformId: ctx.session.profiles![0].platformId,
      },
      where: {
        platformId: {
          not: ctx.from?.id.toString() as string,
        },
        sex:
          ctx.session.myProfile?.interest === 3
            ? undefined
            : ctx.session.myProfile?.interest,
      },
    });
    if (!ctx.session.profiles[0]) {
      ctx.session.profiles = await prisma.profile.findMany({
        take: 1,
        where: {
          platformId: {
            not: ctx.from?.id.toString() as string,
          },
          sex:
            ctx.session.myProfile?.interest === 3
              ? undefined
              : ctx.session.myProfile?.interest,
        },
      });
    }
    // let count = ctx.session.shownProfile!
    const getMedia = await ctx.api.getFile(ctx.session.profiles![0].media);
    const isVideoMedia = (getMedia.file_path as string).includes("videos");
    await ctx[isVideoMedia ? "replyWithVideo" : "replyWithPhoto"](
      ctx.session.profiles![0].media,
      {
        reply_markup: keyboardRate,
        caption: `${ctx.session.profiles![0].name}, ${
          ctx.session.profiles![0].age
        }, ${ctx.session.profiles![0].city}  ${
          ctx.session.profiles![0].description
            ? "- " + ctx.session.profiles![0].description
            : ""
        }`,
      }
    );
    ctx.session.route = "showNewProfiles";
  } else if (ctx.msg.text === "❤️") {
    await prisma.match.create({
      data: {
        fromId: ctx.session.myProfile.platformId,
        toId: ctx.session.profiles![0].platformId,
      },
    });

    // * Вызов события лайка
    let matches = await prisma.match.findMany({
      where: {
        toId: ctx.session.profiles![0].platformId,
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
            published: true,
          },
        },
      },
    });
    // console.log(matches)

    const getSessionUser = await prisma.session.findFirst({
      where: {
        key: ctx.session.profiles![0].platformId,
      },
    });
    let parsedSessionUser = JSON.parse(getSessionUser!.value);
    // ! Добавить проверку, если пользователь уже просматривает людей которые поставли ему лайк, то не запускать следующий сценарий
    parsedSessionUser.route = "chooseMatchesProfiles";
    await prisma.session.update({
      where: {
        key: ctx.session.profiles![0].platformId,
      },
      data: {
        value: JSON.stringify(parsedSessionUser),
      },
    });

    let matchText = "";
    let matchWhoText = "";
    if (ctx.session.profiles![0].interest === 0 && matches.length > 1)
      (matchText = "девушкам"), (matchWhoText = "их");
    else if (ctx.session.profiles![0].interest === 0)
      (matchText = "девушке"), (matchWhoText = "её");
    if (ctx.session.profiles![0].interest === 1 && matches.length > 1)
      (matchText = "парням"), (matchWhoText = "их");
    else if (ctx.session.profiles![0].interest === 1)
      (matchText = "парню"), (matchWhoText = "его");

    await ctx.api.sendMessage(
      ctx.session.profiles![0].platformId,
      `Ты ${ctx.session.profiles![0].sex ? "понравился" : "понравилась"} ${
        matches.length
      } ${matchText}, показать ${matchWhoText}?
          \n1. Показать.\n2. Не хочу больше никого смотреть.`,
      {
        reply_markup: keyboardChooseMatch(ctx).keyboard,
      }
    );

    //---------------------------------
    ctx.session.profiles = await prisma.profile.findMany({
      take: 1,
      skip: 1,
      cursor: {
        platformId: ctx.session.profiles![0].platformId,
      },
      where: {
        platformId: {
          not: ctx.from?.id.toString() as string,
        },
        sex:
          ctx.session.myProfile?.interest === 3
            ? undefined
            : ctx.session.myProfile?.interest,
      },
    });

    if (!ctx.session.profiles[0]) {
      ctx.session.profiles = await prisma.profile.findMany({
        take: 1,
        where: {
          platformId: {
            not: ctx.from?.id.toString() as string,
          },
          sex:
            ctx.session.myProfile?.interest === 3
              ? undefined
              : ctx.session.myProfile?.interest,
        },
      });
    }

    await showProfile(ctx, ctx.session.profiles![0], true);
  }
});

const pauseShow = router.route("pauseShow");

pauseShow.on("msg:text", async (ctx) => {
  if (ctx.msg.text === "1") {
    await ctx.reply("✨🔍");
    await startShowProfile(ctx);
  }

  if (ctx.msg.text === "2") {
    await ctx.reply("Так выглядит твоя анкета:");
    await showProfile(ctx, ctx.session.myProfile!);
    await ctx.reply(
      "1. Заполнить анкету заново. \n2. Изменить фото/видео. \n3. Изменить текст анкеты. \n4. Смотреть анкеты.",
      { reply_markup: keyboardProfile }
    );
    ctx.session.route = "profile";
  }
});

export { router };
