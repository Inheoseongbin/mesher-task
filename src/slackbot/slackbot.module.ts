import { Module } from "@nestjs/common";
import { SlackbotService } from "./slackbot.service";
import { SlackbotController } from "./slackbot.controller";
import { ScheduleModule } from "@nestjs/schedule";
import { HttpModule } from "@nestjs/axios";
import { BlockModule } from "src/block/block.module";

@Module({
    imports: [ScheduleModule.forRoot(),
        HttpModule,
        BlockModule,
    ],
    controllers: [SlackbotController],
    providers: [SlackbotService],
})
export class SlackbotModule { }