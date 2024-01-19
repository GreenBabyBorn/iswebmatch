import "dotenv/config";
import { Bot, GrammyError, HttpError, session, } from "grammy";
import { PrismaAdapter } from "@grammyjs/storage-prisma";
import { composer } from "./composers/index.js";
import { prisma } from "./prisma/index.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function createBot(token, options = {}) {
    // ConversationFlavor;
    // type MyConversation = Conversation<MyContext>;
    const bot = new Bot(token, {
    // client: {
    //     canUseWebhookReply: (method) => method === "sendChatAction",
    // },
    });
    function initial() {
        return {
            route: 'idle'
        };
    }
    function getSessionKey(ctx) {
        return ctx.from?.id.toString();
    }
    bot.use(session({
        initial,
        getSessionKey,
        storage: new PrismaAdapter(prisma.session),
    }));
    // bot.use(sequentialize(getSessionKey));
    /**
     * Conversation
     */
    // async function formFill(conversation: MyConversation, ctx: MyContext) {
    //     await ctx.reply("Сколько тебе лет?", {
    //         reply_markup: { remove_keyboard: true },
    //     });
    //     const age = await conversation.form.number();
    //     console.log(age);
    //     ctx.reply(`Теперь определимся с полом`, {
    //         reply_markup: keyboardSex,
    //     });
    //     const sex = await conversation.form.select(labelsKeyboardSex);
    //     console.log(sex);
    //     await ctx.reply(`Кто тебе интересен?`, {
    //         reply_markup: keyboardInterest,
    //     });
    //     const interest = await conversation.form.select(labelsKeyboardInterest);
    //     console.log(interest);
    //     await ctx.reply(`Из какого ты города?`, {
    //         reply_markup: { remove_keyboard: true },
    //     });
    //     const city = await conversation.form.text();
    //     console.log(city);
    //     const labelsKeyboardName = [];
    //     labelsKeyboardName.push(ctx.from?.first_name as string);
    //     const buttonRows = labelsKeyboardName.map((label) => [Keyboard.text(label)]);
    //     const keyboardName = Keyboard.from(buttonRows).resized().oneTime();
    //     ctx.reply(`Как мне тебя называть?`, {
    //         reply_markup: keyboardName,
    //     });
    //     const name = await conversation.form.text();
    //     console.log(name);
    //     ctx.reply(
    //         `Расскажи о себе и кого хочешь найти, чем предлагаешь заняться. Это поможет лучше подобрать тебе компанию.`,
    //         {
    //             reply_markup: keyboardDescriprion,
    //         }
    //     );
    //     const description = await conversation.form.text();
    //     console.log(description);
    //     await ctx.reply(
    //         `Теперь пришли фото или запиши видео 👍 (до 15 сек), его будут видеть другие пользователи`,
    //         {
    //             reply_markup: { remove_keyboard: true },
    //         }
    //     );
    //     const media = await conversation.waitFor(":media");
    //     const file = await media.getFile();
    //     await conversation.external(async () => {
    //         // let user = await prisma.user.findUnique({
    //         //   where: {
    //         //     fromId: media.from?.id,
    //         //   },
    //         // });
    //         const newProfile = await prisma.profile.create({
    //             data: {
    //                 age: age,
    //                 sex: labelsKeyboardSex.indexOf(sex),
    //                 interest: labelsKeyboardInterest.indexOf(interest),
    //                 city: city,
    //                 name: name,
    //                 description: description === "Пропустить" ? "" : description,
    //                 media: file.file_id,
    //                 platformName: "tg",
    //                 platformId: ctx.from?.id.toString() as string,
    //             },
    //         });
    //         ctx.session.myProfile = newProfile;
    //     });
    //     ctx.reply("Так выглядит твоя анкета:", {
    //         reply_markup: { remove_keyboard: true },
    //     });
    //     const getMedia = await ctx.api.getFile(ctx.session.myProfile.media as string);
    //     const isVideoMedia = (getMedia.file_path as string).includes("videos");
    //     await ctx[isVideoMedia ? "replyWithVideo" : "replyWithPhoto"](
    //         ctx.session.myProfile.media as string,
    //         {
    //             caption: `${"name" in ctx.session.myProfile ? ctx.session.myProfile.name : ""
    //                 }, ${"age" in ctx.session.myProfile ? ctx.session.myProfile.age : ""}, ${"city" in ctx.session.myProfile ? ctx.session.myProfile.city : ""
    //                 } - ${"description" in ctx.session.myProfile
    //                     ? ctx.session.myProfile.description
    //                     : ""
    //                 }`,
    //         }
    //     );
    //     const labelsKeyboardConfirm = ["Да", "Изменить анкету"];
    //     const buttonRowsConfirm = labelsKeyboardConfirm.map((label) => [
    //         Keyboard.text(label.toString()),
    //     ]);
    //     const keyboardConfirm = Keyboard.from(buttonRowsConfirm)
    //         .toFlowed(labelsKeyboardConfirm.length)
    //         .resized()
    //         .oneTime()
    //         .append();
    //     await ctx.reply("Все верно?", {
    //         reply_markup: keyboardConfirm,
    //     });
    //     const confirm = await conversation.form.select(labelsKeyboardConfirm);
    //     if (confirm === labelsKeyboardConfirm[1]) {
    //         await profileMain(conversation, ctx);
    //     }
    // }
    // async function formFillAgain(conversation: MyConversation, ctx: MyContext) {
    //     const labelsKeyboardAge = [];
    //     labelsKeyboardAge.push(ctx.session.myProfile.age as number);
    //     const buttonRowsAge = labelsKeyboardAge.map((label) => [
    //         Keyboard.text(label.toString()),
    //     ]);
    //     const keyboardAge = Keyboard.from(buttonRowsAge).resized().oneTime().append();
    //     await ctx.reply("Сколько тебе лет?", {
    //         reply_markup: keyboardAge,
    //     });
    //     const age = await conversation.form.number();
    //     await ctx.reply(`Теперь определимся с полом`, {
    //         reply_markup: keyboardSex,
    //     });
    //     const sex = await conversation.form.select(labelsKeyboardSex);
    //     await ctx.reply(`Кто тебе интересен?`, {
    //         reply_markup: keyboardInterest,
    //     });
    //     const interest = await conversation.form.select(labelsKeyboardInterest);
    //     await ctx.reply(`Из какого ты города?`, {
    //         reply_markup: { remove_keyboard: true },
    //     });
    //     const city = await conversation.form.text();
    //     const labelsKeyboardName = [];
    //     labelsKeyboardName.push(ctx.session.myProfile.name as string);
    //     labelsKeyboardName.push(ctx.from?.first_name as string);
    //     const buttonRowsName = labelsKeyboardName.map((label) => [
    //         Keyboard.text(label),
    //     ]);
    //     const keyboardName = Keyboard.from(buttonRowsName)
    //         .resized()
    //         .oneTime()
    //         .append();
    //     await ctx.reply(`Как мне тебя называть?`, {
    //         reply_markup: keyboardName,
    //     });
    //     const name = await conversation.form.text();
    //     await ctx.reply(
    //         `Расскажи о себе и кого хочешь найти, чем предлагаешь заняться. Это поможет лучше подобрать тебе компанию.`,
    //         {
    //             reply_markup: keyboardDescriprion,
    //         }
    //     );
    //     const description = await conversation.form.text();
    //     const labelsKeyboardMedia = ["Оставить текущее"];
    //     const buttonRowsMedia = labelsKeyboardMedia.map((label) => [
    //         Keyboard.text(label),
    //     ]);
    //     const keyboardMedia = Keyboard.from(buttonRowsMedia).oneTime().resized();
    //     ctx.reply(
    //         `Теперь пришли фото или запиши видео 👍 (до 15 сек), его будут видеть другие пользователи`,
    //         {
    //             reply_markup: keyboardMedia,
    //         }
    //     );
    //     const media = await conversation.waitFor([":media", ":text"]);
    //     // let file: any = null;
    //     let mediaValue: string | undefined;
    //     if (media.message?.text === labelsKeyboardMedia[0]) {
    //         mediaValue = undefined;
    //     } else {
    //         const file = await media.getFile();
    //         mediaValue = file.file_id;
    //         console.log(file);
    //     }
    //     await conversation.external(async () => {
    //         const newProfile = await prisma.profile.update({
    //             where: {
    //                 id: "id" in ctx.session.myProfile ? ctx.session.myProfile?.id : 1,
    //             },
    //             data: {
    //                 age: age,
    //                 sex: labelsKeyboardSex.indexOf(sex),
    //                 interest: labelsKeyboardInterest.indexOf(interest),
    //                 city: city,
    //                 name: name,
    //                 description: description === "Пропустить" ? "" : description,
    //                 media: mediaValue as Partial<string>,
    //                 platformId: ctx.session.myProfile.platformId as string,
    //             },
    //         });
    //         ctx.session.myProfile = newProfile;
    //     });
    //     ctx.reply("Так выглядит твоя анкета:", {
    //         reply_markup: { remove_keyboard: true },
    //     });
    //     const getMedia = await ctx.api.getFile(ctx.session.myProfile.media as string);
    //     const isVideoMedia = (getMedia.file_path as string).includes("videos");
    //     await ctx[isVideoMedia ? "replyWithVideo" : "replyWithPhoto"](
    //         ctx.session.myProfile.media as string,
    //         {
    //             caption: `${"name" in ctx.session.myProfile ? ctx.session.myProfile.name : ""
    //                 }, ${"age" in ctx.session.myProfile ? ctx.session.myProfile.age : ""}, ${"city" in ctx.session.myProfile ? ctx.session.myProfile.city : ""
    //                 } - ${"description" in ctx.session.myProfile
    //                     ? ctx.session.myProfile.description
    //                     : ""
    //                 }`,
    //         }
    //     );
    //     const labelsKeyboardConfirm = ["Да", "Изменить анкету"];
    //     const buttonRowsConfirm = labelsKeyboardConfirm.map((label) => [
    //         Keyboard.text(label.toString()),
    //     ]);
    //     const keyboardConfirm = Keyboard.from(buttonRowsConfirm)
    //         .toFlowed(labelsKeyboardConfirm.length)
    //         .resized()
    //         .oneTime()
    //         .append();
    //     await ctx.reply("Все верно?", {
    //         reply_markup: keyboardConfirm,
    //     });
    //     const confirm = await conversation.form.select(labelsKeyboardConfirm);
    //     if (confirm === labelsKeyboardConfirm[1]) {
    //         await profileMain(conversation, ctx);
    //     }
    //     // TODO: Сделать просмотр анкет
    // }
    // async function profileMain(conversation: MyConversation, ctx: MyContext) {
    //     await ctx.reply(
    //         "1. Заполнить анкету заново. \n2. Изменить фото/видео. \n3. Изменить текст анкеты. \n4. Смотреть анкеты.",
    //         { reply_markup: keyboardProfile }
    //     );
    //     const mainChoice = await conversation.form.select(["1", "2", "3", "4"]);
    //     if (mainChoice === "1") {
    //         await formFillAgain(conversation, ctx);
    //         return
    //         // if (fillAgain) await profileMain(conversation, ctx);
    //     } else if (mainChoice === "2") {
    //         await ctx.reply("Скоро");
    //         await profileMain(conversation, ctx);
    //         return
    //     } else if (mainChoice === "4") {
    //         await ctx.reply("✨🔍");
    //         await showNewProfiles(conversation, ctx);
    //         return
    //     }
    //     return;
    // }
    // async function showNewProfiles(conversation: MyConversation, ctx: MyContext) {
    //     for (let i = 0; i < ctx.session.profiles.length; i++) {
    //         const getMedia = await ctx.api.getFile(ctx.session.profiles[i].media);
    //         const isVideoMedia = (getMedia.file_path as string).includes("videos");
    //         await ctx[isVideoMedia ? "replyWithVideo" : "replyWithPhoto"](
    //             ctx.session.profiles[i].media,
    //             {
    //                 reply_markup: keyboardRate,
    //                 caption: `${ctx.session.profiles[i].name}, ${ctx.session.profiles[i].age
    //                     }, ${ctx.session.profiles[i].city}  ${ctx.session.profiles[i].description
    //                         ? "- " + ctx.session.profiles[i].name
    //                         : ""
    //                     }`,
    //             }
    //         );
    //         const rate = await conversation.form.select(["❤️", "👎", "💤"]);
    //         if (rate === "💤") {
    //             await stopShow(conversation, ctx);
    //         }
    //         else if (rate === "👎") {
    //             continue;
    //         }
    //         else if (rate === "❤️") {
    //             await conversation.external(async () => {
    //                 // await prisma.match.create({
    //                 //     data: {
    //                 //         fromId: ctx.session.myProfile.platformId as string,
    //                 //         toId: ctx.session.profiles[i].platformId,
    //                 //     },
    //                 // });
    //                 emitter.emit('like', ctx.session.profiles[i].platformId)
    //             });
    //         }
    //     }
    // }
    // async function stopShow(conversation: MyConversation, ctx: MyContext) {
    //     await ctx.reply("Подождем пока кто-то увидит твою анкету");
    //     await ctx.reply(
    //         "1. Смотреть анкеты. \n2. Моя анкета. \n3. Я больше не хочу никого искать.",
    //         { reply_markup: keyboardStop }
    //     );
    //     const stop = await conversation.form.select(labelsKeyboardStop);
    //     if (stop === labelsKeyboardStop[0]) {
    //         await showNewProfiles(conversation, ctx);
    //         return
    //     }
    //     else if (stop === labelsKeyboardStop[1]) {
    //         await conversation.external(async () => {
    //             await showMyProfile(ctx);
    //             // await ctx.conversation.enter("profileMain");
    //         })
    //         await profileMain(conversation, ctx);
    //         return;
    //     }
    //     return
    // }
    // bot.use(conversations());
    // bot.use(createConversation(profileMain))
    //     .use(createConversation(formFill))
    //     .use(createConversation(formFillAgain))
    //     .use(createConversation(showNewProfiles))
    //     .use(createConversation(stopShow));
    // bot.use(async (ctx, next)=>{
    //     console.log(await ctx.conversation.active())
    //    await next()
    // })
    bot.use(composer);
    bot.catch((err) => {
        const ctx = err.ctx;
        console.error(`Error while handling update ${ctx.update.update_id}:`);
        const e = err.error;
        if (e instanceof GrammyError) {
            console.error("Error in request:", e.description);
        }
        else if (e instanceof HttpError) {
            console.error("Could not contact Telegram:", e);
        }
        else {
            console.error("Unknown error:", e);
        }
    });
    // const runner = run(bot);
    process.once("SIGINT", async () => {
        // await runner.stop()
        await bot.stop();
    });
    process.once("SIGTERM", async () => {
        // await runner.stop()
        await bot.stop();
    });
    return bot;
}
