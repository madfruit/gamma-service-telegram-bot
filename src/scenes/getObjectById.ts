import {Scene, ScenesFlavor, ScenesSessionFlavor} from "grammy-scenes"
import {Context, InlineKeyboard, SessionFlavor} from "grammy";
import {BotCommand, BotScene} from "../commands/command";
import {getText, getMessageFromSimbadObject} from "../text";
import {TextShortcut} from "../text/textShortcuts";
import {App} from 'package-app'
import {SimbadActionName, GetObjectByIdPayload, GetObjectByIdResult, ServiceName} from "package-types";
import {getArticleLinks, getArticleTitles} from "../helpers/getArticleLinks";

type SessionData = ScenesSessionFlavor & { };
type BotContext = Context & SessionFlavor<SessionData> & ScenesFlavor
export const getObjectByIdScene = new Scene<BotContext>(BotScene.GetObjectById);

getObjectByIdScene.use(async (ctx, next) => {
    console.log("Entering main scene...");
    await ctx.reply(getText(TextShortcut.IdSearchStart));
    return next();
})

getObjectByIdScene.wait().on("message:text", async (ctx) => {
    const identifier = ctx.message.text;
    const lang = ctx.from.language_code;
    const searchStarted = getText(TextShortcut.IdSearchStarted);
    await ctx.reply(searchStarted);
    const {object, articles} = await App.call<GetObjectByIdPayload, GetObjectByIdResult>(ServiceName.Simbad, SimbadActionName.GetObjectById, {identifier});
    if(Object.keys(object).length === 0) {
        await ctx.reply('Об\'єкт не знайдено!');
        const keyboard = new InlineKeyboard();
        keyboard.text(getText(TextShortcut.IdSearch), BotCommand.StartSearchById);
        await ctx.reply('Шукати ще?', {reply_markup: keyboard});
        return;
    }
    const message = getMessageFromSimbadObject(object);
    await ctx.reply(message);
    const articleLinks = getArticleLinks(articles);
    const articleText = getArticleTitles(articles);
    if(articleLinks.length > 0 && articleText) {
        const keyboard = new InlineKeyboard();
        articleLinks.forEach((link, index) => {
            keyboard.url(`${index+1}`, link);
        });
        keyboard.text(getText(TextShortcut.IdSearch), BotCommand.StartSearchById);
        await ctx.reply(articleText, {reply_markup: keyboard});
    } else {
        const keyboard = new InlineKeyboard();
        keyboard.text(getText(TextShortcut.IdSearch), BotCommand.StartSearchById);
        await ctx.reply('Шукати ще?', {reply_markup: keyboard});
    }
});
