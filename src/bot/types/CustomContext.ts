import { Context, SessionFlavor } from "grammy";
import { FileFlavor } from "@grammyjs/files";

import { SessionData } from "./SessionData.js";

type CustomContext = SessionFlavor<SessionData> & FileFlavor<Context>;

export type { CustomContext };
