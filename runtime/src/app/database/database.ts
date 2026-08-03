import Dexie from 'dexie';

export const db = new Dexie('BombingOutRuntime');

db.version(1).stores({
    runtime_session: `
        id,
        heartbeat,
        tab_id
    `
});