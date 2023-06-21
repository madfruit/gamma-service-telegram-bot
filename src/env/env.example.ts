import { ServiceConfig } from 'package-app';

export const config: ServiceConfig = {
    name: 'telegram-bot',
    brokerConfig: {
        nodeID: 'telegram-bot',
        transporter: 'redis://localhost:6379',
        logger: true,
        logLevel: 'info'
    },
    telegramToken: 'asdasdasdasdasdasdasdasd'
}
export default config;
