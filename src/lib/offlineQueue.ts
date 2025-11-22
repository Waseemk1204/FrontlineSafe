import { openDB } from 'idb';

const DB_NAME = 'frontlinesafe-db';
const STORE_NAME = 'offline-queue';

export const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        },
    });
};

export interface OfflineRequest {
    id?: number;
    url: string;
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    data: any;
    timestamp: number;
}

export const addToQueue = async (request: Omit<OfflineRequest, 'id' | 'timestamp'>) => {
    const db = await initDB();
    await db.add(STORE_NAME, {
        ...request,
        timestamp: Date.now(),
    });
};

export const getQueue = async (): Promise<OfflineRequest[]> => {
    const db = await initDB();
    return db.getAll(STORE_NAME);
};

export const removeFromQueue = async (id: number) => {
    const db = await initDB();
    await db.delete(STORE_NAME, id);
};

export const clearQueue = async () => {
    const db = await initDB();
    await db.clear(STORE_NAME);
};

import { api } from './api';

export const processQueue = async () => {
    const queue = await getQueue();
    if (queue.length === 0) return;

    for (const request of queue) {
        try {
            const { id, url, method, data } = request;
            await api({
                method,
                url,
                data,
            });
            if (id) await removeFromQueue(id);
        } catch (error) {
            console.error('Failed to sync offline request:', error);
            // Keep in queue if it's a network error, maybe remove if 4xx?
            // For now, simple retry logic: keep it.
        }
    }
};
