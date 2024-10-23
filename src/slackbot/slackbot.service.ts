import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { App } from "@slack/bolt";
import axios from "axios";
import { DateTime } from "luxon";
import { BlockService } from "src/block/block.service";

@Injectable()
export class SlackbotService {
    private readonly app: App;
    private webhookUrl = process.env.SLACK_WEBHOOK_URL;

    constructor(
        private readonly blockService: BlockService,
    ) { // 토큰 세팅
        this.app = new App({
            token: process.env.SLACK_BOT_TOKEN,
            signingSecret: process.env.SLACK_SIGNING_SECRET,
            socketMode: true,
            appToken: process.env.SLACK_APP_TOKEN,
        });
    }

    // 모듈이 호출되면 실행됨
    async onModuleInit() {
        await this.app.start();
        console.log('Slack app is running');
    }

    // 메시지 보내기
    async sendMessage(channelId: string, text: string) {
        try {
            await this.app.client.chat.postMessage({
                channel: channelId,
                text: text,
            });
        }
        catch (error) {
            console.error('Error sending message:', error);
        }
    }

    // 이 채널로 보내기 (초대받은 곳의 채널 ID를 갖고오고싶다)
    async notifyChannel(text: string) {
        const channelId = 'C07SZU5QZ37';
        const messageText = text;

        await this.sendMessage(channelId, messageText);
    }


    @Cron('*/5 * * * *') // 5분마다 실행
    async dbCountCheck() {
        const { blockCount, transactionReceiptCount, logCount } = await this.blockService.countData();

        const now = DateTime.now().setZone('Asia/Seoul').toFormat('yyyy. MM. dd. HH:mm:ss');

        const message = `
        Block Count: ${blockCount}
        TransactionReceipt Count: ${transactionReceiptCount}
        Log Count: ${logCount}`;

        this.notifyChannel(`[${now}] : ${message}`);
    }

    async sendWebHook(message: string) {
        try {
            await axios.post(this.webhookUrl, { text: message });
        } catch (error) {
            console.error('Error sending message to Slack:', error);
        }
    }


    @Cron('0 * * * *') // 1시간마다 실행
    serverRunningCheck() {
        const now = DateTime.now().setZone('Asia/Seoul').toFormat('yyyy. MM. dd. HH:mm:ss');

        this.notifyChannel(`[${now}] : Server is Running`);
    }
}