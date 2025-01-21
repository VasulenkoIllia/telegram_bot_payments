import { IStorage } from '@tonconnect/sdk';
import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL,
  // url: 'qwe',
  pingInterval: 30000,
});

client.on('error', (err) => console.log('Redis Client Error', err));

export async function initRedisClient(): Promise<void> {
  console.log('Initializing Redis Client...');
  await client.connect();
  console.log('Connected to Redis Client...');
}

export class TonConnectStorage implements IStorage {
  constructor(private readonly chatId: number) {}

  async removeItem(key: string): Promise<void> {
    await client.del(this.getKey(key));
  }

  async setItem(key: string, value: string): Promise<void> {
    await client.set(this.getKey(key), value);
  }

  async getItem(key: string): Promise<string | null> {
    return (await client.get(this.getKey(key))) || null;
  }

  private getKey(key: string): string {
    return this.chatId.toString() + key;
  }
}
