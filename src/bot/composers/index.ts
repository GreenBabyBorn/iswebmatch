import { Composer } from "grammy";
import { CustomContext } from "../types/CustomContext.js";
import EventEmitter from "events";
import { prisma } from "../prisma/index.js";
import { keyboardProfile } from "../keyboards/index.js";

const composer = new Composer<CustomContext>();

export const showMyProfile = async (ctx: CustomContext) => {
  const getMedia = await ctx.api.getFile(
    ctx.session.myProfile!.media as string,
  );
  const isVideoMedia = (getMedia.file_path as string).includes("videos");
  await ctx[isVideoMedia ? "replyWithVideo" : "replyWithPhoto"](
    ctx.session.myProfile!.media as string,
    {
      caption: `${ctx.session.myProfile!.name}, ${ctx.session.myProfile!.age}, ${ctx.session.myProfile!.city
        } ${ctx.session.myProfile!.description
          ? "- " + ctx.session.myProfile!.description
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
  await showMyProfile(ctx);
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
