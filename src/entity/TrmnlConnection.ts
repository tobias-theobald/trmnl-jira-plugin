import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { JiraConnection } from '@/entity/JiraConnection';
import { JiraSourceType } from '@/types';

@Entity()
export class TrmnlConnection {
    @PrimaryColumn('varchar', { length: 255 })
    accessToken!: string;

    @Column({
        type: 'varchar',
        length: 255,
        unique: true,
        nullable: true,
    })
    uuid!: string | null;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    timeZoneIana!: string | null;

    @Column({
        type: 'varchar',
        length: 16,
        nullable: true,
    })
    locale!: string | null;

    @ManyToOne('JiraConnection', (jiraConnection: JiraConnection) => jiraConnection.trmnlConnections, {
        nullable: true,
        eager: true,
    })
    jiraConnection!: JiraConnection | null;

    // The Jira site to use for this connection. Jira OAuth can give access to multiple sites in one access token.
    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    jiraCloudId!: string | null;

    @Column({
        type: 'varchar',
        length: 255,
        default: 'filter',
    })
    jiraSourceType!: JiraSourceType;

    @Column({
        type: 'text',
        nullable: true,
    })
    jiraJql!: string | null;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    jiraFilterId!: string | null;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    jiraBoardId!: string | null;

    @Column({
        type: 'boolean',
        default: true,
    })
    jiraOnlyIssuesAssignedToMe!: boolean;

    @Column({
        type: 'varchar',
        length: 255,
        array: true,
        default: [],
    })
    jiraAdditionalFields!: string[];

    @Column({
        type: 'varchar',
        length: 255,
        default: 'board',
    })
    displayStyleFull!: 'list' | 'board';

    @Column({
        type: 'varchar',
        length: 255,
        default: 'board',
    })
    displayStyleWide!: 'list' | 'board';

    @Column({
        type: 'varchar',
        length: 255,
        default: 'list',
    })
    displayStyleTall!: 'list' | 'board';

    @Column({
        type: 'varchar',
        length: 255,
        default: 'list',
    })
    displayStyleQuadrant!: 'list' | 'board';

    @Column({
        type: 'varchar',
        length: 255,
        default: ['_category_to_do', '_category_in_progress', '_category_done'],
    })
    boardColumnsByStatus!: string[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
