import { Router } from "@grammyjs/router";
import { CustomContext } from "../types/CustomContext.js";
import { keyboardConfirmProfile, keyboardDescriprion, keyboardInterest, keyboardName, keyboardProfile, keyboardSex, labelsKeyboardConfirmProfile, labelsKeyboardInterest, labelsKeyboardSex } from "../keyboards/index.js";
import { Profile } from "@prisma/client";
import { prisma } from "../prisma/index.js";
import { session } from "grammy";
import { main } from "../composers/index.js";


let profileData: Partial<Profile> = {};
const router = new Router<CustomContext>((ctx) => ctx.session.route);

const fillProfileAge = router.route("fillProfileAge");
fillProfileAge.on('msg:text', async (ctx: CustomContext) => {
    const age = Number(ctx.msg?.text);
    if (isNaN(age)) {
        await ctx.reply('Введи корректный возраст');
        return;
    }
    console.log(age)
    profileData.age = age
    ctx.session.route = 'fillProfileSex'
    await ctx.reply(`Теперь определимся с полом`, {
        reply_markup: keyboardSex,
    });
})


const fillProfileSex = router.route("fillProfileSex");
fillProfileSex.on('msg:text', async (ctx: CustomContext) => {
    const sex = ctx.msg?.text;
    if (!labelsKeyboardSex.includes(sex as string)) {
        await ctx.reply('Введи корректный пол');
    }
    profileData.sex = labelsKeyboardSex.indexOf(sex as string)
    console.log(sex)

    ctx.session.route = 'fillProfileInterest'
    await ctx.reply(`Кто тебе интересен?`, {
        reply_markup: keyboardInterest,
    });
})

const fillProfileInterest = router.route("fillProfileInterest");
fillProfileInterest.on('msg:text', async (ctx: CustomContext) => {
    const interest = ctx.msg?.text;
    if (!labelsKeyboardInterest.includes(interest as string)) {
        await ctx.reply('Кто тебе интересен?');
    }
    profileData.interest = labelsKeyboardInterest.indexOf(interest as string)
    console.log(interest)

    ctx.session.route = 'fillProfileCity'
    await ctx.reply(`Из какого ты города?`, {
        reply_markup: { remove_keyboard: true },
    });
})

const fillProfileCity = router.route("fillProfileCity");
fillProfileCity.on('msg:text', async (ctx: CustomContext) => {
    const city = ctx.msg?.text;
    // TODO: Добавить валидацию города
    profileData.city = city as string;
    console.log(city)

    ctx.session.route = 'fillProfileName'
    await ctx.reply(`Как мне тебя называть?`, {
        reply_markup: keyboardName(ctx),
    });
})


const fillProfileName = router.route("fillProfileName");
fillProfileName.on('msg:text', async (ctx: CustomContext) => {
    const name = ctx.msg?.text;
    profileData.name = name as string
    console.log(name)

    ctx.session.route = 'fillProfileDescription'
    await ctx.reply(
        `Расскажи о себе и кого хочешь найти, чем предлагаешь заняться. Это поможет лучше подобрать тебе компанию.`,
        {
            reply_markup: keyboardDescriprion,
        }
    );
})

const fillProfileDescription = router.route("fillProfileDescription");
fillProfileDescription.on('msg:text', async (ctx: CustomContext) => {
    let description = ctx.msg?.text;
    if (description === 'Пропустить') description = ''
    profileData.description = description as string
    console.log(description)

    ctx.session.route = 'fillProfileMedia'
    await ctx.reply(
        `Теперь пришли фото или запиши видео 👍 (до 15 сек), его будут видеть другие пользователи`,
        {
            reply_markup: { remove_keyboard: true },
        }
    );
})

const fillProfileMedia = router.route("fillProfileMedia");
fillProfileMedia.on('msg:media', async (ctx: CustomContext) => {
    const file = await ctx.getFile();
    profileData.media = file.file_id;
    console.log(file.file_id)

    ctx.session.route = 'fillProfileConfirm'
    await ctx.reply("Все верно?", {
        reply_markup: keyboardConfirmProfile,
    });
})

const fillProfileConfirm = router.route("fillProfileConfirm");
fillProfileConfirm.on('msg:text', async (ctx: CustomContext) => {
    const confirm = ctx.msg?.text
    if (!labelsKeyboardConfirmProfile.includes(confirm as string)) {
        await ctx.reply("Такого ответа нет.", { reply_markup: keyboardConfirmProfile })
    }
    if (confirm === labelsKeyboardConfirmProfile[0]) {
        profileData.platformName = 'tg'
        profileData.platformId = ctx.from?.id.toString() as string
        await prisma.profile.create({
            data: profileData as Profile
        })
        await main(ctx)
        console.log(profileData)
    }
    else if (confirm === labelsKeyboardConfirmProfile[1]) {
        await ctx.reply("Сколько тебе лет?", {
            reply_markup: { remove_keyboard: true },
        });
        ctx.session.route = "fillProfileAge"
    }
    // ctx.session.route = 'fillProfileConfirm'

})

export { router }