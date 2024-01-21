import { Router } from "@grammyjs/router";
import { CustomContext } from "../types/CustomContext.js";
import {
  keyboardCity,
  keyboardConfirmProfile,
  keyboardDescriprion,
  keyboardInterest,
  keyboardMedia,
  keyboardName,
  keyboardProfile,
  keyboardSex,
  labelsKeyboardConfirmProfile,
  labelsKeyboardInterest,
  labelsKeyboardSex,
} from "../keyboards/index.js";
import { Profile } from "@prisma/client";
import { prisma } from "../prisma/index.js";
import { main, showProfile } from "../composers/index.js";

const router = new Router<CustomContext>((ctx) => ctx.session.route);

const updateProfileDescription = router.route("updateProfileDescription");
updateProfileDescription.on("msg:text", async (ctx: CustomContext) => {
  let description = ctx.msg?.text;
  if (description === 'Вернуться назад') {
    await ctx.reply("Так выглядит твоя анкета:");
    await showProfile(ctx, ctx.session.myProfile!);
    await ctx.reply(
      "1. Заполнить анкету заново. \n2. Изменить фото/видео. \n3. Изменить текст анкеты. \n4. Смотреть анкеты.",
      { reply_markup: keyboardProfile },
    );
    ctx.session.route = "profile";
    return;
  }
  const profile = await prisma.profile.update({
    where: {
      id: ctx.session.myProfile.id,
    },
    data: {
      description: description
    },
  });
  ctx.session.myProfile = profile
  await ctx.reply("Так выглядит твоя анкета:");
  await showProfile(ctx,ctx.session.myProfile!);
  await ctx.reply(
    "1. Заполнить анкету заново. \n2. Изменить фото/видео. \n3. Изменить текст анкеты. \n4. Смотреть анкеты.",
    { reply_markup: keyboardProfile },
  );
  ctx.session.route = "profile";
})

const updateProfileMedia = router.route("updateProfileMedia");
updateProfileMedia.on(["msg:text", ":media"], async (ctx: CustomContext) => {


  if (ctx.msg?.text === 'Вернуться назад') {
    await ctx.reply("Так выглядит твоя анкета:");
    await showProfile(ctx, ctx.session.myProfile!);
    await ctx.reply(
      "1. Заполнить анкету заново. \n2. Изменить фото/видео. \n3. Изменить текст анкеты. \n4. Смотреть анкеты.",
      { reply_markup: keyboardProfile },
    );
    ctx.session.route = "profile";
    return;
  }
  if (!ctx.msg?.text) {
    const file = await ctx.getFile();
    const profile = await prisma.profile.update({
      where: {
        id: ctx.session.myProfile.id,
      },
      data: {
        media: file.file_id
      },
    });
    ctx.session.myProfile = profile
    await ctx.reply("Так выглядит твоя анкета:");
    await showProfile(ctx, ctx.session.myProfile!);
    await ctx.reply(
      "1. Заполнить анкету заново. \n2. Изменить фото/видео. \n3. Изменить текст анкеты. \n4. Смотреть анкеты.",
      { reply_markup: keyboardProfile },
    );
    ctx.session.route = "profile";
  }


})

const fillProfileAge = router.route("fillProfileAge");
fillProfileAge.on("msg:text", async (ctx: CustomContext) => {
  const age = Number(ctx.msg?.text);
  if (isNaN(age)) {
    await ctx.reply("Введи корректный возраст");
    return;
  }
  ctx.session.myProfile.age = age;
  ctx.session.route = "fillProfileSex";
  await ctx.reply(`Теперь определимся с полом`, {
    reply_markup: keyboardSex,
  });
});

const fillProfileSex = router.route("fillProfileSex");
fillProfileSex.on("msg:text", async (ctx: CustomContext) => {
  const sex = ctx.msg?.text;
  if (!labelsKeyboardSex.includes(sex as string)) {
    await ctx.reply("Введи корректный пол");
  }
  ctx.session.myProfile.sex = labelsKeyboardSex.indexOf(sex as string);
  console.log(sex);

  ctx.session.route = "fillProfileInterest";
  await ctx.reply(`Кто тебе интересен?`, {
    reply_markup: keyboardInterest,
  });
});

const fillProfileInterest = router.route("fillProfileInterest");
fillProfileInterest.on("msg:text", async (ctx: CustomContext) => {
  const interest = ctx.msg?.text;
  if (!labelsKeyboardInterest.includes(interest as string)) {
    await ctx.reply("Кто тебе интересен?");
  }
  ctx.session.myProfile.interest = labelsKeyboardInterest.indexOf(
    interest as string,
  );
  console.log(interest);

  ctx.session.route = "fillProfileCity";
  await ctx.reply(`Из какого ты города?`, {
    reply_markup: ctx.session.myProfile ? keyboardCity(ctx) : undefined,
  });
});

const fillProfileCity = router.route("fillProfileCity");
fillProfileCity.on("msg:text", async (ctx: CustomContext) => {
  const city = ctx.msg?.text;
  /**
   * TODO: Добавить валидацию города
   */
  ctx.session.myProfile.city = city as string;
  console.log(city);

  ctx.session.route = "fillProfileName";
  await ctx.reply(`Как мне тебя называть?`, {
    reply_markup: keyboardName(ctx),
  });
});

const fillProfileName = router.route("fillProfileName");
fillProfileName.on("msg:text", async (ctx: CustomContext) => {
  const name = ctx.msg?.text;
  ctx.session.myProfile.name = name as string;
  console.log(name);

  ctx.session.route = "fillProfileDescription";
  await ctx.reply(
    `Расскажи о себе и кого хочешь найти, чем предлагаешь заняться. Это поможет лучше подобрать тебе компанию.`,
    {
      reply_markup: keyboardDescriprion,
    },
  );
});

const fillProfileDescription = router.route("fillProfileDescription");
fillProfileDescription.on("msg:text", async (ctx: CustomContext) => {
  let description = ctx.msg?.text;
  if (description === "Пропустить") description = "";
  ctx.session.myProfile.description = description as string;
  console.log(description);

  ctx.session.route = "fillProfileMedia";
  await ctx.reply(
    `Теперь пришли фото или запиши видео 👍 (до 15 сек), его будут видеть другие пользователи`,
    {
      reply_markup: ctx.session.myProfile?.media
        ? keyboardMedia
        : { remove_keyboard: true },
    },
  );
});

const fillProfileMedia = router.route("fillProfileMedia");
fillProfileMedia.on(["msg:media", "msg:text"], async (ctx: CustomContext) => {
  if (!ctx.msg?.text) {
    const file = await ctx.getFile();
    ctx.session.myProfile.media = file.file_id;
    console.log(file.file_id);
  } else if (ctx.msg?.text !== "Оставить текущее") {
    await ctx.reply("Неккоректный ответ");
  }

  ctx.session.route = "fillProfileConfirm";
  await ctx.reply("Все верно?", {
    reply_markup: keyboardConfirmProfile,
  });
  await showProfile(ctx, ctx.session.myProfile!);
});

const fillProfileConfirm = router.route("fillProfileConfirm");
fillProfileConfirm.on("msg:text", async (ctx: CustomContext) => {
  const confirm = ctx.msg?.text;
  if (!labelsKeyboardConfirmProfile.includes(confirm as string)) {
    await ctx.reply("Такого ответа нет.", {
      reply_markup: keyboardConfirmProfile,
    });
  }
  if (confirm === labelsKeyboardConfirmProfile[0]) {
    if (ctx.session.myProfile.platformId) {
      await prisma.profile.update({
        where: {
          id: ctx.session.myProfile.id,
        },
        data: ctx.session.myProfile as Profile,
      });
    } else {
      ctx.session.myProfile.platformId = ctx.from?.id.toString() as string;
      await prisma.profile.create({
        data: {
          ...ctx.session.myProfile! as Profile,
          id: undefined
        },
      });
    }

    await main(ctx);
    // console.log(ctx.session.myProfile)
  } else if (confirm === labelsKeyboardConfirmProfile[1]) {
    await ctx.reply(
      "1. Заполнить анкету заново. \n2. Изменить фото/видео. \n3. Изменить текст анкеты. \n4. Смотреть анкеты.",
      { reply_markup: keyboardProfile },
    );
    ctx.session.route = "profile";
  }
});

export { router };
