import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

import { TrmnlConnection } from '@/entity/TrmnlConnection';

@Entity()
export class JiraConnection {
    @PrimaryColumn('varchar', {
        length: 255,
        nullable: false,
    })
    atlassianAccountId!: string;

    @Column({
        type: 'varchar',
        length: 1024,
        nullable: false,
    })
    accessTokenEncrypted!: string;

    @Column({
        type: 'timestamp',
        nullable: false,
    })
    accessTokenExpiresAt!: Date;

    @Column({
        type: 'varchar',
        length: 1024,
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

    @OneToMany(() => TrmnlConnection, (trmnlConnection) => trmnlConnection.jiraConnection)
    trmnlConnections!: TrmnlConnection[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
