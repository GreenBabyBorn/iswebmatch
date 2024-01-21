import { Router } from "@grammyjs/router";
import { CustomContext } from "../types/CustomContext.js";
import { keyboardPause, keyboardProfile, keyboardRate } from "../keyboards/index.js";
import { emitter, showProfile } from "../composers/index.js";
import { prisma } from "../prisma/index.js";
import { startShowProfile } from "./profile.js";

const router = new Router<CustomContext>((ctx) => {
    return ctx.session.route
});

const showNewProfiles = router.route("showNewProfiles");


showNewProfiles.on('msg:text', async (ctx) => {
    if (ctx.msg.text === "💤") {
        await ctx.reply("Подождем пока кто-то увидит твою анкету");
        await ctx.reply(
            "1. Смотреть анкеты. \n2. Моя анкета. \n3. Я больше не хочу никого искать.",
            { reply_markup: keyboardPause }
        );
        ctx.session.route = 'pauseShow'
    }
    else if (ctx.msg.text === "👎") {
        ctx.session.profiles = await prisma.profile.findMany({
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
        ctx.session.shownProfile! += 1;
        if (ctx.session.profiles!.length === ctx.session.shownProfile!) {
            ctx.session.shownProfile = 0
        }
        let count = ctx.session.shownProfile!
        const getMedia = await ctx.api.getFile(ctx.session.profiles![count].media);
        const isVideoMedia = (getMedia.file_path as string).includes("videos");
        await ctx[isVideoMedia ? "replyWithVideo" : "replyWithPhoto"](
            ctx.session.profiles![count].media,
            {
                reply_markup: keyboardRate,
                caption: `${ctx.session.profiles![count].name}, ${ctx.session.profiles![count].age
                    }, ${ctx.session.profiles![count].city}  ${ctx.session.profiles![count].description
                        ? "- " + ctx.session.profiles![count].description
                        : ""
                    }`,
            }
        );
        ctx.session.route = "showNewProfiles"
    }
    else if (ctx.msg.text === "❤️") {
        await prisma.match.create({
            data: {
                fromId: ctx.session.myProfile.platformId,
                toId: ctx.session.profiles![ctx.session.shownProfile!].platformId
            }
        })

        // * Вызов события лайка 
        emitter.emit(ctx.session.profiles![ctx.session.shownProfile!].platformId, ctx.session.profiles![ctx.session.shownProfile!].platformId)

        ctx.session.profiles = await prisma.profile.findMany({
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
        ctx.session.shownProfile! += 1;
        if (ctx.session.profiles!.length === ctx.session.shownProfile!) {
            ctx.session.shownProfile = 0
        }
        let count = ctx.session.shownProfile!

        const getMedia = await ctx.api.getFile(ctx.session.profiles![count].media);
        const isVideoMedia = (getMedia.file_path as string).includes("videos");
        await ctx[isVideoMedia ? "replyWithVideo" : "replyWithPhoto"](
            ctx.session.profiles![count].media,
            {
                reply_markup: keyboardRate,
                caption: `${ctx.session.profiles![count].name}, ${ctx.session.profiles![count].age
                    }, ${ctx.session.profiles![count].city}  ${ctx.session.profiles![count].description
                        ? "- " + ctx.session.profiles![count].description
                        : ""
                    }`,
            }
        );
    }

})

const pauseShow = router.route("pauseShow");

pauseShow.on('msg:text', async (ctx) => {
    if (ctx.msg.text === '1') {
        await ctx.reply("✨🔍");
        await startShowProfile(ctx)
    }

    if (ctx.msg.text === '2') {
        await ctx.reply("Так выглядит твоя анкета:");
        await showProfile(ctx, ctx.session.myProfile!);
        await ctx.reply(
            "1. Заполнить анкету заново. \n2. Изменить фото/видео. \n3. Изменить текст анкеты. \n4. Смотреть анкеты.",
            { reply_markup: keyboardProfile },
        );
        ctx.session.route = "profile";

    }
})


const showMatchesProfiles = router.route("showMatchesProfiles");

showMatchesProfiles.on('msg:text', async (ctx) => {
    
})

export { router }