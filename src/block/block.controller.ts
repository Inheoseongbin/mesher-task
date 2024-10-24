import { Controller, Get, Param } from "@nestjs/common";
import { BlockService } from "./block.service";

@Controller('block')
export class BlockController {
    constructor(private readonly blockService: BlockService) { }

    @Get(':getLasthash')
    getLastHash() {
        return this.blockService.getLastHash();
    }

    @Get('/:hash')
    registByHash(@Param('hash') hash: string) {
        return this.blockService.registByHash(hash);
    }

    // @Get(':findHash')
    // findOne(@Param('hash') hash: string) {
    //     return this.blockService.findOne(hash);
    // }
}