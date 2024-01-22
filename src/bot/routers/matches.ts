import { Router } from "@grammyjs/router";
import { CustomContext } from "../types/CustomContext.js";
import {
  keyboardChooseMatch,
  keyboardContinue,
  keyboardPause,
  keyboardProfile,
  keyboardRate,
} from "../keyboards/index.js";
import { prisma } from "../prisma/index.js";
import { Chat } from "grammy/types";
import { startShowProfile } from "./profile.js";

const router = new Router<CustomContext>((ctx) => {
  return ctx.session.route;
});

const continueShowProfiles = router.route("continueShowProfiles");

continueShowProfiles.on("msg:text", async (ctx) => {
  if (ctx.msg.text === "Продолжить просмотр анкет") {
    await startShowProfile(ctx);
    ctx.session.route = "showNewProfiles";
  }
});

const chooseMatchesProfiles = router.route("chooseMatchesProfiles");

chooseMatchesProfiles.on("msg:text", async (ctx) => {
  if (ctx.msg.text === keyboardChooseMatch(ctx).labels[0]) {
    // if (!ctx.session.shownMatchProfile) ctx.session.shownMatchProfile = 0;
    await startShowMatchProfiles(ctx);
    ctx.session.route = "showMatchesProfiles";
  }
  if (ctx.msg.text === keyboardChooseMatch(ctx).labels[1]) {
    await ctx.reply(keyboardChooseMatch(ctx).labels[1]);
    // ! Доделать ответ с меню
  }
});

const showMatchesProfiles = router.route("showMatchesProfiles");

showMatchesProfiles.on("msg:text", async (ctx) => {
  if (ctx.msg.text === "💤") {
    // ! Доделать ответ с меню
  } else if (ctx.msg.text === "👎") {
    // await prisma.match.delete({
    //   where: {
    //     fromId_toId: {
    //       fromId: ctx.session.activeMatchProfile[0].fromId,
    //       toId: ctx.session.activeMatchProfile[0].toId,
    //     },
    //   },
    // });
    await prisma.match.delete({
      where: {
        fromId_toId: {
          fromId: ctx.session.activeMatchProfile[0].fromId,
          toId: ctx.session.myProfile.platformId,
        },
      },
    });
    ctx.session.activeMatchProfile = await prisma.match.findMany({
      take: 1,
      skip: 1,
      cursor: {
        fromId_toId: {
          toId: ctx.session.activeMatchProfile[0].toId,
          fromId: ctx.session.activeMatchProfile[0].fromId,
        },
      },
      where: {
        toId: ctx.session.myProfile.platformId,
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
    await startShowMatchProfiles(ctx);
    // if (!ctx.session.activeMatchProfile[0]) {
    //   ctx.session.activeMatchProfile = await prisma.match.findMany({
    //     take: 1,
    //     where: {
    //       toId: ctx.session.myProfile.platformId,
    //     },
    //     include: {
    //       from: {
    //         select: {
    //           name: true,
    //           sex: true,
    //           age: true,
    //           interest: true,
    //           description: true,
    //           city: true,
    //           media: true,
    //           platformId: true,
    //           published: true,
    //         },
    //       },
    //     },
    //   });
    // }

    // const matchesCount = await prisma.match.count({
    //   where: {
    //     toId: ctx.session.myProfile.platformId,
    //   },
    // });
    // const profile = ctx.session.activeMatchProfile![0].from;

    // const getMedia = await ctx.api.getFile(profile.media);
    // const isVideoMedia = (getMedia.file_path as string).includes("videos");
    // await ctx[isVideoMedia ? "replyWithVideo" : "replyWithPhoto"](
    //   profile.media,
    //   {
    //     reply_markup: keyboardRate,
    //     caption: `Кому-то понравилась твоя анкета ${
    //       matchesCount > 1 ? `(и еще ${matchesCount})` : ""
    //     }\n\n${profile.name}, ${profile.age}, ${profile.city}  ${
    //       profile.description ? "- " + profile.description : ""
    //     }`,
    //   }
    // );
    // ctx.session.route = "showMatchesProfiles";
  } else if (ctx.msg.text === "❤️") {
    // await prisma.match.delete({
    //   where: {
    //     fromId_toId: {
    //       fromId: ctx.session.activeMatchProfile![0].from.platformId,
    //       toId: ctx.session.myProfile!.platformId,
    //     },
    //   },
    // });
    await prisma.match.delete({
      where: {
        fromId_toId: {
          fromId: ctx.session.activeMatchProfile[0].fromId,
          toId: ctx.session.myProfile.platformId,
        },
      },
    });

    await ctx.reply(
      `Отлично! Надеюсь хорошо проведете время ;) Начинай общаться 👉 <a href="${`tg://user?id=${
        ctx.session.activeMatchProfile![0].from.platformId
      }`}">${ctx.session.activeMatchProfile![0].from.name}</a>`,
      {
        parse_mode: "HTML",
        link_preview_options: {
          is_disabled: true,
        },
      }
    );
    // console.log((await ctx.api.getChat(ctx.session.activeMatchProfile!.platformId) as Chat.PrivateGetChat).has_private_forwards, (await ctx.api.getChat(ctx.session.myProfile.platformId) as Chat.PrivateGetChat).has_private_forwards)
    await ctx.api.sendMessage(
      ctx.session.activeMatchProfile![0].from.platformId,
      `Есть взаимная симпатия! Начинай общаться 👉 <a href="tg://user?id=${
        ctx.session.myProfile!.platformId
      }">${ctx.session.myProfile!.name}</a>`,
      {
        parse_mode: "HTML",
        link_preview_options: {
          is_disabled: true,
        },
      }
    );

    ctx.session.activeMatchProfile = await prisma.match.findMany({
      take: 1,
      skip: 1,
      cursor: {
        fromId_toId: {
          toId: ctx.session.myProfile.platformId,
          fromId: ctx.session.activeMatchProfile![0].fromId,
        },
      },
      where: {
        toId: ctx.session.myProfile.platformId,
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

    // if (
    //   (
    //     (await ctx.api.getChat(
    //       ctx.session.myProfile.platformId
    //     )) as Chat.PrivateGetChat
    //   ).has_private_forwards
    // ) {
    //   await ctx.reply(
    //     `❗️ Твой профиль ограничен из-за настроек приватности Telegram.\n😟 Тебе не могут написать люди с которыми у тебя взаимная симпатия.\n\n❤️ Чтобы снять ограничения измени настройки приватности в Telegram:\n👉 Настройки➡️Конфиденциальность➡️Пересылка сообщений➡️Кто может ссылаться➡️Все`
    //   );
    // }
    // if (
    //   (
    //     (await ctx.api.getChat(
    //       ctx.session.activeMatchProfile![0].from.platformId
    //     )) as Chat.PrivateGetChat
    //   ).has_private_forwards
    // ) {
    //   await ctx.api.sendMessage(
    //     ctx.session.activeMatchProfile![0].from.platformId,
    //     `❗️ Твой профиль ограничен из-за настроек приватности Telegram.\n😟 Тебе не могут написать люди с которыми у тебя взаимная симпатия.\n\n❤️ Чтобы снять ограничения измени настройки приватности в Telegram:\n👉 Настройки➡️Конфиденциальность➡️Пересылка сообщений➡️Кто может ссылаться➡️Все`
    //   );
    // }

    if (!ctx.session.activeMatchProfile[0]) {
      ctx.session.activeMatchProfile = await prisma.match.findMany({
        take: 1,
        where: {
          toId: ctx.session.myProfile.platformId,
        },
        include: {
          from: {
            select: {
              platformName: true,
              id: true,
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
    }

    if (!ctx.session.activeMatchProfile[0]) {
      await ctx.reply("Это всё, идем дальше?", {
        reply_markup: keyboardContinue,
      });
      ctx.session.route = "continueShowProfiles";
      return;
    }

    let matchesCount = await prisma.match.count({
      where: {
        toId: ctx.session.myProfile.platformId,
      },
    });

    // matchesCount--;

    const profile = ctx.session.activeMatchProfile![0].from;

    const getMedia = await ctx.api.getFile(profile.media);
    const isVideoMedia = (getMedia.file_path as string).includes("videos");
    await ctx[isVideoMedia ? "replyWithVideo" : "replyWithPhoto"](
      profile.media,
      {
        reply_markup: keyboardRate,
        caption: `Кому-то понравилась твоя анкета ${
          matchesCount > 1 ? `(и еще ${matchesCount})` : ""
        }\n\n${profile.name}, ${profile.age}, ${profile.city}  ${
          profile.description ? "- " + profile.description : ""
        }`,
      }
    );
    ctx.session.route = "showMatchesProfiles";
  }
});

const startShowMatchProfiles = async (ctx: CustomContext) => {
  // await prisma.match.delete({
  //   where: {
  //     fromId_toId: {
  //       fromId: ctx.session.activeMatchProfile[0].fromId,
  //       toId: ctx.session.activeMatchProfile[0].toId,
  //     },
  //   },
  // });
  if (!ctx.session.activeMatchProfile![0]) {
    ctx.session.activeMatchProfile = await prisma.match.findMany({
      take: 1,
      where: {
        toId: ctx.session.myProfile.platformId,
      },
      include: {
        from: {
          select: {
            platformName: true,
            id: true,
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
  }

  let matchesCount = await prisma.match.count({
    where: {
      toId: ctx.session.myProfile.platformId,
    },
  });

  matchesCount--;
  if (!ctx.session.activeMatchProfile![0]) {
    await ctx.reply("Это всё, идем дальше?", {
      reply_markup: keyboardContinue,
    });

    ctx.session.route = "continueShowProfiles";
    return;
  }
  const profile = ctx.session.activeMatchProfile![0].from;

  const getMedia = await ctx.api.getFile(profile.media);
  const isVideoMedia = (getMedia.file_path as string).includes("videos");
  await ctx[isVideoMedia ? "replyWithVideo" : "replyWithPhoto"](profile.media, {
    reply_markup: keyboardRate,
    caption: `Кому-то понравилась твоя анкета ${
      matchesCount > 1 ? `(и еще ${matchesCount})` : ""
    }\n\n${profile.name}, ${profile.age}, ${profile.city}  ${
      profile.description ? "- " + profile.description : ""
    }`,
  });
  ctx.session.route = "showMatchesProfiles";
};

// const showMatchProfile = async (ctx: CustomContext) => {

// }

export { router };
