import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class TrmnlConnection {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        length: 255,
        unique: true,
        nullable: false,
    })
    accessToken!: string;

    @Column({
        length: 255,
        unique: true,
        nullable: true,
    })
    uuid!: string;

    @Column({
        type: 'integer',
        nullable: true,
    })
    utcOffset!: number;

    @Column({
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
