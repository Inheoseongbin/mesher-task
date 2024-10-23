import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ethers } from "ethers";
import { Block } from "./entities/block.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class BlockService {
    private provider: ethers.InfuraProvider;

    constructor(
        @InjectRepository(Block)
        private blockRepository: Repository<Block>,
    ) {
        this.provider = new ethers.InfuraProvider('mainnet', process.env.API_KEY);
    }

    async getLastHash() {
        return await this.provider.getBlock('latest');
    }

    async registByHash(hash: string) {
        const getBlock = await this.provider.getBlock(hash);
        const block = new Block();

        if (!getBlock) {
            throw new NotFoundException();
        }

        block.blockNumber = getBlock.number;
        block.hash = getBlock.hash;

        block.log = [] as string[];

        await Promise.all(
            getBlock.transactions.map(async (tx) => {
                const receipt = await this.provider.getTransactionReceipt(tx);
                block.log.push(JSON.stringify(receipt.logs));
            }),
        );

        block.transactionReceipt = JSON.stringify(getBlock.transactions);
        await this.blockRepository.save(block);
    }


    findOne(hash: string) {
        const block = this.blockRepository.findOneBy({ hash });

        if (!block) {
            throw new NotFoundException();
        }
        return block;
    }


    async getBlock(blockHash: string) {
        try {
            // return await this.provider.getBlock('latest');
            //blockHash 0x8155361371abdbc4beeb235ea9371523af394d8e7f4041bfdea8ed41d0fec0f9
            const block = await this.provider.getBlock(blockHash);
            if (!block) {
                throw new NotFoundException(`Block not found`);
            }

            const TransactionReceipts = await Promise.all(
                block.transactions.map(async (tx) => {
                    const receipt = await this.provider.getTransactionReceipt(tx);
                    return {
                        receipt: receipt,
                        logs: receipt.logs,
                    };
                }),
            );

            return {
                block,
                transactions: TransactionReceipts,
            };
        }
        catch (error) {
            throw new InternalServerErrorException(`Failed to fetch block: ${error.message}`);
        }
    }

    async countData() {
        const blockCount = await this.blockRepository.count();

        const blocks = await this.blockRepository.find();
        let transactionReceiptCount = 0;
        let logCount = 0;

        blocks.forEach(block => {
            try {
                transactionReceiptCount += block.transactionReceipt.length;
            } catch (error) {
                console.error(`Invalid JSON in block.transactionReceipt: ${block.transactionReceipt}`, error);
            }

            logCount += block.log.length;
        });

        return {
            blockCount,
            transactionReceiptCount,
            logCount
        };
    }
}