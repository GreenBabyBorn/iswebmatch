import { CommandContext, Composer } from "grammy";
import { CustomContext } from "../types/CustomContext.js";
import EventEmitter from "events";
import { prisma } from "../prisma/index.js";

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

const main = async (ctx: CommandContext<CustomContext>) => {
    const profile = await prisma.profile.findFirst({
        where: {
            platformId: ctx.from?.id.toString(),
            platformName: "tg",
        },
    });
    if (!profile) {
        // await ctx.conversation.enter("formFill");
        return;
    }

    ctx.session.myProfile = profile;
    await showMyProfile(ctx);
    ctx.session.profiles = await prisma.profile.findMany({
        where: {
            sex:
                ctx.session.myProfile?.interest === 3
                    ? undefined
                    : ctx.session.myProfile?.interest,
        },
    });

    // await ctx.conversation.exit()
    // await ctx.conversation.enter("profileMain");
};

composer.command("start", async (ctx) => {
    await main(ctx);
});

const emitter = new EventEmitter();
composer.command("myprofile", async (ctx) => {
    emitter.on("like", async (args) => {
        console.log(args, ctx.session.myProfile!.platformId, ctx.from?.id);
        if (args === ctx.session.myProfile!.platformId) {
            await ctx.reply('Ты кому-то понравился!!!')

        }
    });

    console.log(emitter.listeners('like',));
    await main(ctx);
});

export { composer };