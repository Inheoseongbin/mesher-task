import { Controller, Get, Param } from "@nestjs/common";
import { ReceiptService } from "./receipt.service";

@Controller('receipt')
export class ReceiptController {
    constructor(private readonly receiptService: ReceiptService) { }

    @Get(':hash')
    async getReceipt(@Param('hash') hash: string) {
        return this.receiptService.getReceipt(hash);
    }

    @Get(':hash/to')
    async getToReceipt(@Param('hash') hash: string) {
        return this.receiptService.getToReceipt(hash);
    }

    @Get(':hash/from')
    async getFromReceipt(@Param('hash') hash: string) {
        return this.receiptService.getFromReceipt(hash);
    }
}