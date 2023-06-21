import {App} from 'package-app';
import initCommands from "./commands";
import {config} from "./env/env";

const app = App.getInstance();

async function main(): Promise<void> {
    await app.run({
        name: config.name
    });
    const { telegramToken } = config;
    await initCommands(telegramToken!);
}

main().then();

