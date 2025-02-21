import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

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
    uuid!: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    timeZoneIana!: string;

    @Column({
        type: 'varchar',
        length: 16,
        nullable: true,
    })
    locale!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
