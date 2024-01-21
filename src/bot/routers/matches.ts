import { Router } from "@grammyjs/router";
import { CustomContext } from "../types/CustomContext.js";
import { keyboardChooseMatch, keyboardPause, keyboardProfile, keyboardRate } from "../keyboards/index.js";
import { prisma } from "../prisma/index.js";
import { Chat } from "grammy/types";

const router = new Router<CustomContext>((ctx) => {
    return ctx.session.route
});

const chooseMatchesProfiles = router.route("chooseMatchesProfiles");

chooseMatchesProfiles.on('msg:text', async (ctx) => {
    if (ctx.msg.text === keyboardChooseMatch(ctx).labels[0]) {
        if (!ctx.session.shownMatchProfile) ctx.session.shownMatchProfile = 0
        await startShowMatchProfiles(ctx)
        ctx.session.route = 'showMatchesProfiles'
    }
    if (ctx.msg.text === keyboardChooseMatch(ctx).labels[1]) {
        await ctx.reply(keyboardChooseMatch(ctx).labels[1])
    }
})

const showMatchesProfiles = router.route("showMatchesProfiles");

showMatchesProfiles.on('msg:text', async (ctx) => {
    if (ctx.msg.text === "💤") { }
    else if (ctx.msg.text === "👎") { 
        await prisma.match.delete({
            where: {
                fromId_toId: {
                    fromId: ctx.session.activeMatchProfile!.platformId,
                    toId: ctx.session.myProfile!.platformId
                }
            }
        })
    }
    else if (ctx.msg.text === "❤️") {
        await prisma.match.delete({
            where: {
                fromId_toId: {
                    fromId: ctx.session.activeMatchProfile!.platformId,
                    toId: ctx.session.myProfile!.platformId
                }
            }
        })

        if ((await ctx.api.getChat(ctx.session.myProfile.platformId) as Chat.PrivateGetChat).has_private_forwards) {
            await ctx.reply(`❗️ Твой профиль ограничен из-за настроек приватности Telegram.\n😟 Тебе не могут написать люди с которыми у тебя взаимная симпатия.\n\n❤️ Чтобы снять ограничения измени настройки приватности в Telegram:\n👉 Настройки➡️Конфиденциальность➡️Пересылка сообщений➡️Кто может ссылаться➡️Все`)
        }
        if((await ctx.api.getChat(ctx.session.activeMatchProfile!.platformId) as Chat.PrivateGetChat).has_private_forwards){
            await ctx.api.sendMessage(ctx.session.activeMatchProfile!.platformId,`❗️ Твой профиль ограничен из-за настроек приватности Telegram.\n😟 Тебе не могут написать люди с которыми у тебя взаимная симпатия.\n\n❤️ Чтобы снять ограничения измени настройки приватности в Telegram:\n👉 Настройки➡️Конфиденциальность➡️Пересылка сообщений➡️Кто может ссылаться➡️Все`)
        }

        await ctx.reply(`Отлично! Надеюсь хорошо проведете время ;) Начинай общаться 👉 <a href="${`tg://user?id=${ctx.session.activeMatchProfile!.platformId}`}">${ctx.session.activeMatchProfile!.name}</a>`, {
            parse_mode: "HTML", link_preview_options: {
                is_disabled: true
            }
        })
        // console.log((await ctx.api.getChat(ctx.session.activeMatchProfile!.platformId) as Chat.PrivateGetChat).has_private_forwards, (await ctx.api.getChat(ctx.session.myProfile.platformId) as Chat.PrivateGetChat).has_private_forwards)
        await ctx.api.sendMessage(ctx.session.activeMatchProfile!.platformId, `Есть взаимная симпатия! Начинай общаться 👉 <a href="tg://user?id=${ctx.session.myProfile!.platformId}">${ctx.session.myProfile!.name}</a>`, {
            parse_mode: "HTML",
            link_preview_options: {
                is_disabled: true
            },

        })
    }
})

const startShowMatchProfiles = async (ctx: CustomContext) => {
    
    let matches: any = await prisma.match.findMany({

        where: {
            toId: ctx.session.myProfile.platformId
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
    const profile = matches[ctx.session.shownMatchProfile!].from
    console.log(profile)
    ctx.session.activeMatchProfile = profile
    const getMedia = await ctx.api.getFile(profile.media);
    const isVideoMedia = (getMedia.file_path as string).includes("videos");
    await ctx[isVideoMedia ? "replyWithVideo" : "replyWithPhoto"](
        profile.media,
        {
            reply_markup: keyboardRate,
            caption: `Кому-то понравилась твоя анкета ${matches.length > 1 ? `(и еще ${matches.length})` : ''}\n\n${profile.name}, ${profile.age
                }, ${profile.city}  ${profile.description
                    ? "- " + profile.description
                    : ""
                }`,
        }
    );
    ctx.session.route = "showMatchesProfiles"
}

// const showMatchProfile = async (ctx: CustomContext) => {

// }

export { router }