import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import redis from '../src/config/redis.js';

let mongo: MongoMemoryServer;

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);
});

beforeEach(async () => {
    const collections = await mongoose.connection.db!.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
    await redis.flushall();
});

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
    await redis.quit();
});
