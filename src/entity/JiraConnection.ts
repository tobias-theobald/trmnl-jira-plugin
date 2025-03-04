import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

import type { TrmnlConnection } from '@/entity/TrmnlConnection';

@Entity()
export class JiraConnection {
    @PrimaryColumn('varchar', {
        length: 255,
        nullable: false,
    })
    atlassianAccountId!: string;

    @Column({
        type: 'text',
        nullable: false,
    })
    accessTokenEncrypted!: string;

    @Column({
        type: 'timestamp',
        nullable: false,
    })
    accessTokenExpiresAt!: Date;

    @Column({
        type: 'text',
        nullable: false,
    })
    refreshTokenEncrypted!: string;

    @Column({
        type: 'timestamp',
        nullable: false,
    })
    refreshTokenExpiresAt!: Date;

    @Column({
        type: 'timestamp',
        nullable: false,
    })
    absoluteRefreshTokenExpiresAt!: Date;

    @OneToMany('TrmnlConnection', (trmnlConnection: TrmnlConnection) => trmnlConnection.jiraConnection, {
        eager: false,
    })
    trmnlConnections!: Promise<TrmnlConnection[]>;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
