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
const grammy_1 = require("grammy");
const bot = new grammy_1.Bot(process.env.BOT_TOKEN);
const keyboardProfile = new grammy_1.Keyboard()
    .text("1. Заполнить анкету заново.")
    .text("2. Изменить фото/видео.")
    .row()
    .text("3. Изменить текст анкеты.")
    .text("4. Смотреть анкеты.")
    .resized();
const profile = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply("Ваша анкета:", { reply_markup: keyboardProfile });
});
bot.command("start", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    profile(ctx);
}));
bot.command("myprofile", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    profile(ctx);
}));
bot.start();
