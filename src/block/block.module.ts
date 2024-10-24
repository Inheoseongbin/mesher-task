import { Module } from "@nestjs/common";
import { BlockController } from "./block.controller";
import { BlockService } from "./block.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Block } from "./entities/block.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Block])],
    controllers: [BlockController],
    providers: [BlockService],
    exports: [BlockService],
})
export class BlockModule { }