import { Controller } from "@nestjs/common";
import { SlackbotService } from "./slackbot.service";

@Controller('notify')
export class SlackbotController {
    constructor(private readonly slackbotService: SlackbotService) { }
}