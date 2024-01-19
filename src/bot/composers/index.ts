import { CommandContext, Composer } from "grammy";
import { CustomContext } from "../types/CustomContext.js";
import EventEmitter from "events";
import { prisma } from "../prisma/index.js";


import { keyboardProfile } from "../keyboards/index.js";
import { router as profile   } from "../routers/profile.js";
import { router as fillProfile   } from "../routers/fillProfile.js";

const composer = new Composer<CustomContext>();

const showMyProfile = async (ctx: CustomContext) => {
    await ctx.reply("Ваша анкета:");
    const getMedia = await ctx.api.getFile(ctx.session.myProfile!.media);
    const isVideoMedia = (getMedia.file_path as string).includes("videos");
    await ctx[isVideoMedia ? "replyWithVideo" : "replyWithPhoto"](
        ctx.session.myProfile!.media as string,
        {
            caption: `${ctx.session.myProfile!.name}, ${ctx.session.myProfile!.age}, ${ctx.session.myProfile!.city
                } ${ctx.session.myProfile!.description
                    ? "- " + ctx.session.myProfile!.description
                    : ""
                }`,
        }
    );
}

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
    // await showMyProfile(ctx);
    ctx.session.profiles = await prisma.profile.findMany({
        where: {
            sex:
                ctx.session.myProfile?.interest === 3
                    ? undefined
                    : ctx.session.myProfile?.interest,
        },
    });

    await showMyProfile(ctx);
    await ctx.reply(
                "1. Заполнить анкету заново. \n2. Изменить фото/видео. \n3. Изменить текст анкеты. \n4. Смотреть анкеты.",
                { reply_markup: keyboardProfile }
            );
    ctx.session.route = "profile";
    // await ctx.conversation.exit()
    // await ctx.conversation.enter("profileMain");
};



composer.command("start", async (ctx) => {
    await main(ctx);
});

const emitter = new EventEmitter();
composer.command("myprofile", async (ctx) => {
    // emitter.on("like", async (args) => {
    //     console.log(args, ctx.session.myProfile!.platformId, ctx.from?.id);
    //     if (args === ctx.session.myProfile!.platformId) {
    //         await ctx.reply('Ты кому-то понравился!!!')

    //     }
    // });
    // console.log(emitter.listeners('like',));


    await main(ctx);
   
});



// router.otherwise(async (ctx)=>{
//     await ctx.reply("Нет такого варианта ответа")
// })

composer.use(profile)
composer.use(fillProfile)

export { composer };