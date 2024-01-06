"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const grammy_1 = require("grammy");
const conversations_1 = require("@grammyjs/conversations");
const files_1 = require("@grammyjs/files");
const prisma = new client_1.PrismaClient();
const bot = new grammy_1.Bot(process.env.BOT_TOKEN);
bot.api.config.use((0, files_1.hydrateFiles)(bot.token));
function initial() {
    return {
        userId: 0,
        myProfile: {},
        profiles: {},
    };
}
bot.use((0, grammy_1.session)({ initial }));
bot.use((0, conversations_1.conversations)());
function formFill(conversation, ctx) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        yield ctx.reply("Сколько тебе лет?", {
            reply_markup: { remove_keyboard: true },
        });
        const age = yield conversation.form.number();
        console.log(age);
        yield ctx.reply(`Теперь определимся с полом`, {
            reply_markup: keyboardSex,
        });
        const sex = yield conversation.form.select(labelsKeyboardSex);
        console.log(sex);
        yield ctx.reply(`Кто тебе интересен?`, {
            reply_markup: keyboardInterest,
        });
        const interest = yield conversation.form.select(labelsKeyboardInterest);
        console.log(interest);
        yield ctx.reply(`Из какого ты города?`, {
            reply_markup: { remove_keyboard: true },
        });
        const city = yield conversation.form.text();
        console.log(city);
        const labelsKeyboardName = [];
        labelsKeyboardName.push((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.first_name);
        const buttonRows = labelsKeyboardName.map((label) => [grammy_1.Keyboard.text(label)]);
        const keyboardName = grammy_1.Keyboard.from(buttonRows).resized().oneTime();
        yield ctx.reply(`Как мне тебя называть?`, {
            reply_markup: keyboardName,
        });
        const name = yield conversation.form.text();
        console.log(name);
        yield ctx.reply(`Расскажи о себе и кого хочешь найти, чем предлагаешь заняться. Это поможет лучше подобрать тебе компанию.`, {
            reply_markup: keyboardDescriprion,
        });
        const description = yield conversation.form.text();
        console.log(description);
        yield ctx.reply(`Теперь пришли фото или запиши видео 👍 (до 15 сек), его будут видеть другие пользователи`, {
            reply_markup: { remove_keyboard: true },
        });
        const media = yield conversation.waitFor(":media");
        const file = yield media.getFile();
        // const file: any = await media.getFile(); // valid for at least 1 hour
        // const path = file.file_path; // file path on Bot API server
        console.log(file);
        yield conversation.external(() => __awaiter(this, void 0, void 0, function* () {
            // let user = await prisma.user.findUnique({
            //   where: {
            //     fromId: media.from?.id,
            //   },
            // });
            const newProfile = yield prisma.profile.create({
                data: {
                    age: age,
                    sex: labelsKeyboardSex.indexOf(sex),
                    interest: labelsKeyboardInterest.indexOf(interest),
                    city: city,
                    name: name,
                    description: description,
                    media: file.file_id,
                    userId: ctx.session.userId,
                },
            });
            ctx.session.myProfile = newProfile;
        }));
        yield media.conversation.enter("profileMain");
        return;
    });
}
function formFillAgain(conversation, ctx) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const labelsKeyboardAge = [];
        labelsKeyboardAge.push(ctx.session.myProfile.age);
        const buttonRowsAge = labelsKeyboardAge.map((label) => [
            grammy_1.Keyboard.text(label.toString()),
        ]);
        const keyboardAge = grammy_1.Keyboard.from(buttonRowsAge).resized().oneTime().append();
        yield ctx.reply("Сколько тебе лет?", {
            reply_markup: keyboardAge,
        });
        const age = yield conversation.form.number();
        yield ctx.reply(`Теперь определимся с полом`, {
            reply_markup: keyboardSex,
        });
        const sex = yield conversation.form.select(labelsKeyboardSex);
        yield ctx.reply(`Кто тебе интересен?`, {
            reply_markup: keyboardInterest,
        });
        const interest = yield conversation.form.select(labelsKeyboardInterest);
        yield ctx.reply(`Из какого ты города?`, {
            reply_markup: { remove_keyboard: true },
        });
        const city = yield conversation.form.text();
        const labelsKeyboardName = [];
        labelsKeyboardName.push(ctx.session.myProfile.name);
        labelsKeyboardName.push((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.first_name);
        const buttonRowsName = labelsKeyboardName.map((label) => [
            grammy_1.Keyboard.text(label),
        ]);
        const keyboardName = grammy_1.Keyboard.from(buttonRowsName)
            .resized()
            .oneTime()
            .append();
        yield ctx.reply(`Как мне тебя называть?`, {
            reply_markup: keyboardName,
        });
        const name = yield conversation.form.text();
        yield ctx.reply(`Расскажи о себе и кого хочешь найти, чем предлагаешь заняться. Это поможет лучше подобрать тебе компанию.`, {
            reply_markup: keyboardDescriprion,
        });
        const description = yield conversation.form.text();
        const labelsKeyboardMedia = ["Оставить текущее"];
        const buttonRowsMedia = labelsKeyboardMedia.map((label) => [
            grammy_1.Keyboard.text(label),
        ]);
        const keyboardMedia = grammy_1.Keyboard.from(buttonRowsMedia).oneTime().resized();
        yield ctx.reply(`Теперь пришли фото или запиши видео 👍 (до 15 сек), его будут видеть другие пользователи`, {
            reply_markup: keyboardMedia,
        });
        const media = yield conversation.waitFor([":media", ":text"]);
        const file = yield media.getFile();
        console.log(file);
        // let file: any = null;
        let mediaValue = null;
        if (((_b = media.message) === null || _b === void 0 ? void 0 : _b.text) === labelsKeyboardMedia[0]) {
            mediaValue = undefined;
        }
        else {
            const file = yield media.getFile();
            mediaValue = file.file_id;
            console.log(file);
        }
        // if(media.message?.text === labelsKeyboardMedia[0]){
        // }
        yield conversation.external(() => __awaiter(this, void 0, void 0, function* () {
            var _c;
            const newProfile = yield prisma.profile.update({
                where: {
                    id: "id" in ctx.session.myProfile ? (_c = ctx.session.myProfile) === null || _c === void 0 ? void 0 : _c.id : 1,
                },
                data: {
                    age: age,
                    sex: labelsKeyboardSex.indexOf(sex),
                    interest: labelsKeyboardInterest.indexOf(interest),
                    city: city,
                    name: name,
                    description: description === "Пропустить" ? "" : description,
                    media: mediaValue,
                    // media: file.file_id,
                    // media: media.message?.text === labelsKeyboardMedia[0] ? undefined : file.file_id,
                    userId: ctx.session.userId,
                },
            });
            ctx.session.myProfile = newProfile;
        }));
        yield ctx.reply("Так выглядит твоя анкета:", {
            reply_markup: { remove_keyboard: true },
        });
        const getMedia = yield ctx.api.getFile(ctx.session.myProfile.media);
        const isVideoMedia = getMedia.file_path.includes("videos");
        yield ctx[isVideoMedia ? "replyWithVideo" : "replyWithPhoto"](ctx.session.myProfile.media, {
            caption: `${"name" in ctx.session.myProfile ? ctx.session.myProfile.name : ""}, ${"age" in ctx.session.myProfile ? ctx.session.myProfile.age : ""}, ${"city" in ctx.session.myProfile ? ctx.session.myProfile.city : ""} - ${"description" in ctx.session.myProfile
                ? ctx.session.myProfile.description
                : ""}`,
        });
        const labelsKeyboardConfirm = ["Да", "Изменить анкету"];
        const buttonRowsConfirm = labelsKeyboardConfirm.map((label) => [
            grammy_1.Keyboard.text(label.toString()),
        ]);
        const keyboardConfirm = grammy_1.Keyboard.from(buttonRowsConfirm)
            .toFlowed(labelsKeyboardConfirm.length)
            .resized()
            .oneTime()
            .append();
        yield ctx.reply("Все верно?", {
            reply_markup: keyboardConfirm,
        });
        const confirm = yield conversation.form.select(labelsKeyboardConfirm);
        if (confirm === labelsKeyboardConfirm[1]) {
            yield profileMain(conversation, ctx);
        }
    });
}
function profileMain(conversation, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ctx.reply("1. Заполнить анкету заново. \n2. Изменить фото/видео. \n3. Изменить текст анкеты. \n4. Смотреть анкеты.", { reply_markup: keyboardProfile });
        const mainChoice = yield conversation.form.select(["1", "2", "3", "4"]);
        if (mainChoice === "1") {
            const fillAgain = yield formFillAgain(conversation, ctx);
            // if (fillAgain) await profileMain(conversation, ctx);
        }
        else if (mainChoice === "2") {
            yield ctx.reply("Скоро");
            yield profileMain(conversation, ctx);
        }
    });
}
function showNewProfiles(conversation, ctx) {
    return __awaiter(this, void 0, void 0, function* () { });
}
bot.use((0, conversations_1.createConversation)(formFill));
bot.use((0, conversations_1.createConversation)(formFillAgain));
bot.use((0, conversations_1.createConversation)(profileMain));
bot.use((0, conversations_1.createConversation)(showNewProfiles));
const labelsKeyboardSex = ["Я девушка", "Я парень"];
const buttonRowsSex = labelsKeyboardSex.map((label) => [grammy_1.Keyboard.text(label)]);
const keyboardSex = grammy_1.Keyboard.from(buttonRowsSex)
    .toFlowed(labelsKeyboardSex.length)
    .resized()
    .oneTime();
const labelsKeyboardInterest = ["Девушки", "Парни", "Не важно"];
const buttonRowsInterest = labelsKeyboardInterest.map((label) => [
    grammy_1.Keyboard.text(label),
]);
const keyboardInterest = grammy_1.Keyboard.from(buttonRowsInterest)
    .toFlowed(labelsKeyboardInterest.length)
    .resized()
    .oneTime();
const keyboardDescriprion = new grammy_1.Keyboard()
    .text("Пропустить")
    .row()
    .resized()
    .oneTime();
const keyboardProfile = new grammy_1.Keyboard()
    .text("1")
    .text("2")
    .text("3")
    .text("4")
    .row()
    .resized()
    .oneTime();
const profile = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    let user = yield prisma.user.findUnique({
        where: {
            fromId: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id,
        },
    });
    if (!user) {
        user = yield prisma.user.create({
            data: {
                fromId: (_b = ctx.from) === null || _b === void 0 ? void 0 : _b.id,
                firstName: "first_name" in ctx.chat ? (_c = ctx.chat) === null || _c === void 0 ? void 0 : _c.first_name : "",
                username: "username" in ctx.chat ? (_d = ctx.chat) === null || _d === void 0 ? void 0 : _d.username : "",
            },
        });
    }
    ctx.session.userId = user.id;
    const profile = yield prisma.profile.findFirst({
        where: {
            userId: user.id,
        },
    });
    if (!profile) {
        yield ctx.conversation.enter("formFill");
        return;
    }
    ctx.session.myProfile = profile;
    yield ctx.reply("Ваша анкета:");
    const getMedia = yield ctx.api.getFile(ctx.session.myProfile.media);
    const isVideoMedia = getMedia.file_path.includes("videos");
    yield ctx[isVideoMedia ? "replyWithVideo" : "replyWithPhoto"](ctx.session.myProfile.media, {
        caption: `${"name" in ctx.session.myProfile ? ctx.session.myProfile.name : ""}, ${"age" in ctx.session.myProfile ? ctx.session.myProfile.age : ""}, ${"city" in ctx.session.myProfile ? ctx.session.myProfile.city : ""} - ${"description" in ctx.session.myProfile
            ? ctx.session.myProfile.description
            : ""}`,
    });
    ctx.session.profiles = yield prisma.profile.findMany({
        where: {
            sex: ((_e = ctx.session.myProfile) === null || _e === void 0 ? void 0 : _e.interest) === 3
                ? undefined
                : (_f = ctx.session.myProfile) === null || _f === void 0 ? void 0 : _f.interest,
        },
    });
    yield ctx.conversation.enter("profileMain");
    //   await ctx.conversation.exit()
});
bot.command("start", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    //   console.log(ctx.chat);
    yield profile(ctx);
}));
bot.command("myprofile", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield profile(ctx);
}));
bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof grammy_1.GrammyError) {
        console.error("Error in request:", e.description);
    }
    else if (e instanceof grammy_1.HttpError) {
        console.error("Could not contact Telegram:", e);
    }
    else {
        console.error("Unknown error:", e);
    }
});
process.once("SIGINT", () => void bot.stop());
process.once("SIGTERM", () => void bot.stop());
void bot.start();
