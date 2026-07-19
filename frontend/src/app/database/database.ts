import Dexie from 'dexie';

export const db = new Dexie('BombingOutFrontend');

db.version(1).stores({
    frontend_session: `
        id,
        login_at,
        heartbeat
    `
});