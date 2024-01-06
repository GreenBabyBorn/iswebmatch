import "dotenv/config";
import { PrismaClient, type Profile } from "@prisma/client";
import {
  Api,
  Bot,
  CommandContext,
  Context,
  GrammyError,
  HttpError,
  Keyboard,
  session,
  SessionFlavor,
} from "grammy";
import {
  type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import { FileApiFlavor, FileFlavor, hydrateFiles } from "@grammyjs/files";

type MyContext = FileFlavor<Context> &
  SessionFlavor<SessionData> &
  ConversationFlavor;

type MyConversation = Conversation<MyContext>;

interface SessionData {
  userId: number;
  myProfile: Profile | object;
}

const prisma = new PrismaClient();
const bot = new Bot<MyContext, FileApiFlavor<Api>>(
  process.env.BOT_TOKEN as string
);
bot.api.config.use(hydrateFiles(bot.token));

function initial(): SessionData {
  return {
    userId: 0,
    myProfile: {},
  };
}
bot.use(session({ initial }));
bot.use(conversations());

async function formFill(conversation: MyConversation, ctx: MyContext) {
  await ctx.reply("Сколько тебе лет?", {
    reply_markup: { remove_keyboard: true },
  });
  const age = await conversation.form.number();
  console.log(age);

  await ctx.reply(`Теперь определимся с полом`, {
    reply_markup: keyboardSex,
  });
  const sex = await conversation.form.select(labelsKeyboardSex);
  console.log(sex);

  await ctx.reply(`Кто тебе интересен?`, {
    reply_markup: keyboardInterest,
  });
  const interest = await conversation.form.select(labelsKeyboardInterest);
  console.log(interest);

  await ctx.reply(`Из какого ты города?`, {
    reply_markup: { remove_keyboard: true },
  });
  const city = await conversation.form.text();
  console.log(city);

  const labelsKeyboardName = [];
  labelsKeyboardName.push(ctx.from?.first_name as string);
  const buttonRows = labelsKeyboardName.map((label) => [Keyboard.text(label)]);
  const keyboardName = Keyboard.from(buttonRows).resized().oneTime();
  await ctx.reply(`Как мне тебя называть?`, {
    reply_markup: keyboardName,
  });
  const name = await conversation.form.text();
  console.log(name);

  await ctx.reply(
    `Расскажи о себе и кого хочешь найти, чем предлагаешь заняться. Это поможет лучше подобрать тебе компанию.`,
    {
      reply_markup: keyboardDescriprion,
    }
  );
  const description = await conversation.form.text();
  console.log(description);
  await ctx.reply(
    `Теперь пришли фото или запиши видео 👍 (до 15 сек), его будут видеть другие пользователи`,
    {
      reply_markup: { remove_keyboard: true },
    }
  );
  const media = await conversation.waitFor(":media");
  const file: any = await media.getFile();
  // const file: any = await media.getFile(); // valid for at least 1 hour
  // const path = file.file_path; // file path on Bot API server
  console.log(file.file_id);

  await conversation.external(async () => {
    // let user = await prisma.user.findUnique({
    //   where: {
    //     fromId: media.from?.id,
    //   },
    // });
    const newProfile = await prisma.profile.create({
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
  });

  await media.conversation.enter("profileMain");
  return;
}

async function formFillAgain(conversation: MyConversation, ctx: MyContext) {
  const labelsKeyboardAge = [];
  labelsKeyboardAge.push(
    "age" in ctx.session.myProfile ? ctx.session.myProfile.age : ""
  );
  const buttonRowsAge = labelsKeyboardAge.map((label) => [
    Keyboard.text(label.toString()),
  ]);
  const keyboardAge = Keyboard.from(buttonRowsAge).resized().oneTime().append();
  await ctx.reply("Сколько тебе лет?", {
    reply_markup: keyboardAge,
  });
  const age = await conversation.form.number();

  await ctx.reply(`Теперь определимся с полом`, {
    reply_markup: keyboardSex,
  });
  const sex = await conversation.form.select(labelsKeyboardSex);

  await ctx.reply(`Кто тебе интересен?`, {
    reply_markup: keyboardInterest,
  });
  const interest = await conversation.form.select(labelsKeyboardInterest);

  await ctx.reply(`Из какого ты города?`, {
    reply_markup: { remove_keyboard: true },
  });
  const city = await conversation.form.text();

  const labelsKeyboardName = [];
  labelsKeyboardName.push(
    "name" in ctx.session.myProfile ? ctx.session.myProfile.name : ""
  );
  labelsKeyboardName.push(ctx.from?.first_name as string);
  const buttonRowsName = labelsKeyboardName.map((label) => [
    Keyboard.text(label),
  ]);
  const keyboardName = Keyboard.from(buttonRowsName)
    .resized()
    .oneTime()
    .append();
  await ctx.reply(`Как мне тебя называть?`, {
    reply_markup: keyboardName,
  });
  const name = await conversation.form.text();

  await ctx.reply(
    `Расскажи о себе и кого хочешь найти, чем предлагаешь заняться. Это поможет лучше подобрать тебе компанию.`,
    {
      reply_markup: keyboardDescriprion,
    }
  );
  const description = await conversation.form.text();

  const labelsKeyboardMedia = ["Оставить текущее"];
  const buttonRowsMedia = labelsKeyboardMedia.map((label) => [
    Keyboard.text(label),
  ]);
  const keyboardMedia = Keyboard.from(buttonRowsMedia).oneTime().resized();
  await ctx.reply(
    `Теперь пришли фото или запиши видео 👍 (до 15 сек), его будут видеть другие пользователи`,
    {
      reply_markup: keyboardMedia,
    }
  );
  const media = await conversation.waitFor([":media", ":text"]);
  // let file: any = null;
  let mediaValue: any = null;
  if (media.message?.text === labelsKeyboardMedia[0]) {
    mediaValue = undefined
  }
  else{
    const file: any =  await media?.getFile()
    mediaValue = file.file_id
  }

  // if(media.message?.text === labelsKeyboardMedia[0]){
    
  // }

  await conversation.external(async () => {
    const newProfile = await prisma.profile.update({
      where: {
        id: "id" in ctx.session.myProfile ? ctx.session.myProfile?.id : 1,
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
  });

  await ctx.reply("Так выглядит твоя анкета:", {
    reply_markup: { remove_keyboard: true },
  });

  const getMedia: any = await ctx.api.getFile(
    "media" in ctx.session.myProfile ? ctx.session.myProfile.media : ""
  );
  const isVideoMedia = getMedia.file_path.includes("videos");

  await ctx[isVideoMedia ? "replyWithVideo" : "replyWithPhoto"](
    "media" in ctx.session.myProfile ? ctx.session.myProfile.media : "",
    {
      caption: `${
        "name" in ctx.session.myProfile ? ctx.session.myProfile.name : ""
      }, ${"age" in ctx.session.myProfile ? ctx.session.myProfile.age : ""}, ${
        "city" in ctx.session.myProfile ? ctx.session.myProfile.city : ""
      } - ${
        "description" in ctx.session.myProfile
          ? ctx.session.myProfile.description
          : ""
      }`,
    }
  );
  const labelsKeyboardConfirm = ["Да", "Изменить анкету"];
  const buttonRowsConfirm = labelsKeyboardConfirm.map((label) => [
    Keyboard.text(label.toString()),
  ]);
  const keyboardConfirm = Keyboard.from(buttonRowsConfirm)
    .toFlowed(labelsKeyboardConfirm.length)
    .resized()
    .oneTime()
    .append();
  await ctx.reply("Все верно?", {
    reply_markup: keyboardConfirm,
  });
  const confirm = await conversation.form.select(labelsKeyboardConfirm);
  if (confirm === labelsKeyboardConfirm[1]) {
    await profileMain(conversation, ctx);
  }
  // TODO: Сделать просмотр анкет
}

async function profileMain(conversation: MyConversation, ctx: MyContext) {
  await ctx.reply(
    "1. Заполнить анкету заново. \n2. Изменить фото/видео. \n3. Изменить текст анкеты. \n4. Смотреть анкеты.",
    { reply_markup: keyboardProfile }
  );

  const mainChoice = await conversation.form.select(["1", "2", "3", "4"]);

  if (mainChoice === "1") {
    const fillAgain = await formFillAgain(conversation, ctx);
    // if (fillAgain) await profileMain(conversation, ctx);
  } else if (mainChoice === "2") {
    await ctx.reply("Скоро");
    await profileMain(conversation, ctx);
  }
}

async function showNewProfiles(conversation: MyConversation, ctx: MyContext){
  
}

bot.use(createConversation(formFill));
bot.use(createConversation(formFillAgain));
bot.use(createConversation(profileMain));
bot.use(createConversation(showNewProfiles));

const labelsKeyboardSex = ["Я девушка", "Я парень"];
const buttonRowsSex = labelsKeyboardSex.map((label) => [Keyboard.text(label)]);
const keyboardSex = Keyboard.from(buttonRowsSex)
  .toFlowed(labelsKeyboardSex.length)
  .resized()
  .oneTime();

const labelsKeyboardInterest = ["Девушки", "Парни", "Не важно"];
const buttonRowsInterest = labelsKeyboardInterest.map((label) => [
  Keyboard.text(label),
]);
const keyboardInterest = Keyboard.from(buttonRowsInterest)
  .toFlowed(labelsKeyboardInterest.length)
  .resized()
  .oneTime();
const keyboardDescriprion = new Keyboard()
  .text("Пропустить")
  .row()
  .resized()
  .oneTime();

const keyboardProfile = new Keyboard()
  .text("1")
  .text("2")
  .text("3")
  .text("4")
  .row()
  .resized()
  .oneTime();

const profile = async (ctx: CommandContext<MyContext>) => {
  let user = await prisma.user.findUnique({
    where: {
      fromId: ctx.from?.id,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        fromId: ctx.from?.id as number,
        firstName: "first_name" in ctx.chat ? ctx.chat?.first_name : "",
        username: "username" in ctx.chat ? (ctx.chat?.username as string) : "",
      },
    });
  }
  ctx.session.userId = user.id;
  const profile = await prisma.profile.findFirst({
    where: {
      userId: user.id,
    },
  });
  if (!profile) {
    await ctx.conversation.enter("formFill");
    return;
  }
  ctx.session.myProfile = profile;
  await ctx.reply("Ваша анкета:");

  const getMedia: any = await ctx.api.getFile(
    "media" in ctx.session.myProfile ? ctx.session.myProfile.media : ""
  );
  const isVideoMedia = getMedia.file_path.includes("videos");

  await ctx[isVideoMedia ? "replyWithVideo" : "replyWithPhoto"](
    "media" in ctx.session.myProfile ? ctx.session.myProfile.media : "",
    {
      caption: `${
        "name" in ctx.session.myProfile ? ctx.session.myProfile.name : ""
      }, ${"age" in ctx.session.myProfile ? ctx.session.myProfile.age : ""}, ${
        "city" in ctx.session.myProfile ? ctx.session.myProfile.city : ""
      } - ${
        "description" in ctx.session.myProfile
          ? ctx.session.myProfile.description
          : ""
      }`,
    }
  );
  await ctx.conversation.enter("profileMain");

  //   await ctx.conversation.exit()
};

bot.command("start", async (ctx) => {
  //   console.log(ctx.chat);
  await profile(ctx);
});

bot.command("myprofile", async (ctx) => {
  await profile(ctx);
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

process.once("SIGINT", () => void bot.stop());
process.once("SIGTERM", () => void bot.stop());

void bot.start();
