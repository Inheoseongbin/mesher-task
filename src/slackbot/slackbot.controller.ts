import { Controller, Post } from "@nestjs/common";
import { SlackbotService } from "./slackbot.service";

@Controller('notify')
export class SlackbotController {
    constructor(private readonly slackbotService: SlackbotService) { }

    // @Post()
    // async sendNotification() {
    //     await this.slackbotService.notifyChannel('gd');
    //     return { message: 'Notification sent!'};
    // }
}