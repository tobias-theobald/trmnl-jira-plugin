import 'reflect-metadata';

import * as process from 'node:process';

import { DataSource } from 'typeorm';

import { JiraConnection } from '@/entity/JiraConnection';
import { TrmnlConnection } from '@/entity/TrmnlConnection';

const appDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [TrmnlConnection, JiraConnection],
    synchronize: true,
    logging: false,
});

async function initDb() {
    try {
        await appDataSource.initialize();
        console.info('database connection initialized');
        return {
            appDataSource,
            TrmnlConnectionRepository: appDataSource.getRepository<TrmnlConnection>(TrmnlConnection),
            JiraConnectionRepository: appDataSource.getRepository<JiraConnection>(JiraConnection),
        };
    } catch (e) {
        console.error('error initializing database connection', e);
        process.exit(1);
    }
}

let dbInitPromise: null | ReturnType<typeof initDb> = null;

// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
export const dbInit = () => {
    if (dbInitPromise === null) {
        return (dbInitPromise = initDb());
    }
    return dbInitPromise;
};
