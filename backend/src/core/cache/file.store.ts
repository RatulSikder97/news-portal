
import { Injectable } from '@nestjs/common';

import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FileStore {
    private cacheDir = '.cache';

    constructor() {
        this.ensureCacheDir();
    }

    private async ensureCacheDir() {
        try {
            await fs.access(this.cacheDir);
        } catch {
            await fs.mkdir(this.cacheDir, { recursive: true });
        }
    }

    private getFilePath(key: string): string {
        // Sanitize key to be safe for filenames
        const safeKey = key.replace(/[^a-z0-9]/gi, '_');
        return path.join(this.cacheDir, `${safeKey}.json`);
    }

    async get<T>(key: string): Promise<T | undefined> {
        try {
            const filePath = this.getFilePath(key);
            const data = await fs.readFile(filePath, 'utf8');
            const entry = JSON.parse(data);

            if (Date.now() > entry.expiry) {
                await this.del(key);
                return undefined;
            }

            return entry.value as T;
        } catch (error) {
            return undefined;
        }
    }

    async set<T>(key: string, value: T, options?: any): Promise<void> {
        await this.ensureCacheDir();
        const filePath = this.getFilePath(key);

        let ttl = 30000; // default 30s
        if (typeof options === 'number') {
            ttl = options;
        } else if (options && options.ttl) {
            ttl = options.ttl;
        }


        if (ttl < 10000) ttl = ttl * 1000;

        const entry = {
            value,
            expiry: Date.now() + ttl,
        };

        await fs.writeFile(filePath, JSON.stringify(entry), 'utf8');
    }

    async del(key: string): Promise<void> {
        try {
            const filePath = this.getFilePath(key);
            await fs.unlink(filePath);
        } catch { }
    }

    async mget(...args: string[]): Promise<unknown[]> {
        return Promise.all(args.map(key => this.get(key)));
    }

    async mset(args: [string, unknown][], ttl?: number): Promise<void> {
        await Promise.all(args.map(([key, value]) => this.set(key, value, ttl)));
    }
}
