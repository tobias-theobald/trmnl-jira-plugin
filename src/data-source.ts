import 'reflect-metadata';

import * as process from 'node:process';

import { DataSource } from 'typeorm';

import { TrmnlConnection } from './entity/TrmnlConnection';

const appDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [TrmnlConnection],
    synchronize: true,
    logging: false,
});

// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
export const dbInit = appDataSource
    .initialize()
    .then(() => {
        // here you can start to work with your database
        console.info('database connection initialized');
        return {
            appDataSource,
            TrmnlConnectionRepository: appDataSource.getRepository<TrmnlConnection>(TrmnlConnection),
        };
    })
    .catch((error) => {
        console.error('error initializing database connection', error);
        process.exit(1);
    });
