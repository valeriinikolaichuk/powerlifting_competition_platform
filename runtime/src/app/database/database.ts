import Dexie from 'dexie';

export const db = new Dexie('BombingOutRuntime');

db.version(1).stores({
    frontend_session: `
        id,
        heartbeat,
        tab_id
    `
});