import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Block {
    @PrimaryColumn()
    blockNumber: number;

    @PrimaryColumn()
    hash: string;

    @Column({ type: 'json' })
    transactionReceipt: string;

    @Column({ type: 'json' })
    log: string[];
}