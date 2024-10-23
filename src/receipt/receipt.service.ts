import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ethers } from "ethers";

@Injectable()
export class ReceiptService {
    private provider: ethers.InfuraProvider;

    constructor() {
        this.provider = new ethers.InfuraProvider('mainnet', process.env.API_KEY);
    }

    // 트랜잭션 영수증을 가져오는 공통 메서드
    private async fetchTransactionReceipt(receiptHash: string) {
        try {
            const receipt = await this.provider.getTransactionReceipt(receiptHash);

            if (!receipt) {
                throw new NotFoundException(`Transaction receipt not found`);
            }

            return receipt;
        } catch (error) {
            throw new InternalServerErrorException(`Failed to fetch receipt: ${error.message}`);
        }
    }

    // 거래내역 전체 가져오기
    async getReceipt(receiptHash: string) {
        const receipt = await this.fetchTransactionReceipt(receiptHash);

        return {
            receipt: receipt,
            logs: receipt.logs,
        };
    }

    // 수신 주소 기준으로 조회
    async getToReceipt(receiptHash: string) {
        const receipt = await this.fetchTransactionReceipt(receiptHash);

        return {
            to: receipt.to,
            logs: receipt.logs,
        };
    }

    // 발신 주소 기준으로 조회
    async getFromReceipt(receiptHash: string) {
        const receipt = await this.fetchTransactionReceipt(receiptHash);

        return {
            from: receipt.from,
            logs: receipt.logs,
        };
    }
}