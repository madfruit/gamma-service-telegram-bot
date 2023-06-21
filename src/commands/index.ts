import {getObjectByIdScene} from "../scenes/getObjectById";

import {Bot, Context, session, SessionFlavor} from "grammy"
import {ScenesSessionFlavor, ScenesFlavor, ScenesComposer} from "grammy-scenes"
import {BotCommand, BotScene} from "./command";
import {Language} from "package-types";
import {getText} from "../text";
import {TextShortcut} from "../text/textShortcuts";
import {hydrateReply, parseMode, ParseModeFlavor} from "@grammyjs/parse-mode";


export default async function initCommands(telegramToken: string) {
    type SessionData = ScenesSessionFlavor & {
    }

    type BotContext = Context & SessionFlavor<SessionData> & ScenesFlavor

    const bot = new Bot<ParseModeFlavor<BotContext>>(telegramToken);
    bot.api.config.use(parseMode("HTML"));

    bot.use(hydrateReply);
    bot.use(
        session({
            initial: () => ({}),
        })
    )

    const scenes = new ScenesComposer<BotContext>(getObjectByIdScene)
    bot.use(scenes.manager())

    bot.command("start", async (ctx) => {
        await ctx.reply(getText(TextShortcut.Greeting), {
            reply_markup: {
                inline_keyboard: [
                    [{text: getText(TextShortcut.IdSearch), callback_data: BotCommand.StartSearchById}],
                ]
            }
        });
    });

    bot.callbackQuery(BotCommand.StartSearchById, async (ctx) => {
        await ctx.answerCallbackQuery();
        await ctx.scenes.enter(BotScene.GetObjectById);
    });

    bot.use(scenes);

    bot.start();
}
