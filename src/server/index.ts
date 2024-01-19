import express from "express";
import type { CreateBot } from "../bot/index.js";
import { webhookCallback, API_CONSTANTS, BotError } from "grammy";

export const createServer = async (bot: CreateBot) => {
  const server = express(); // or whatever you're using
  server.use(express.json()); // parse the JSON request body

  server.get("/", (req, res) => res.send({ status: true }));
  // server.use(async (err: any, req: any, res: any, next: any) => {
  //     if (err instanceof BotError) {
  //         await res.code(200).send({});
  //     }
  //   })

  server.get(`/${bot.token}`, async (request, response) => {
    const hostname = request.headers["x-forwarded-host"];
    console.log(hostname);
    if (typeof hostname === "string") {
      const webhookUrl = new URL(bot.token, `https://${hostname}`).href;
      bot.api.setWebhook(webhookUrl, {
        allowed_updates: API_CONSTANTS.ALL_UPDATE_TYPES,
      });
      response.send({
        status: true,
      });
    } else {
      response.status(500).send({
        status: false,
      });
    }
  });

  server.use(webhookCallback(bot, "express"));

  return server;
};
