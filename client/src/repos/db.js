import { openDB } from "idb";

export const TITLES_STORE = 'titles'
export const FILES_STORE = 'files'
export const FILES_HASH_INDEX = 'hash'
/**
 * 
 * @param {import("idb").IDBPDatabase} db 
 */
function v1(db) {
    db.createObjectStore(TITLES_STORE, { autoIncrement: true, keyPath: 'id' })
    const files = db.createObjectStore(FILES_STORE, { autoIncrement: true, keyPath: 'id' })
    files.createIndex(FILES_HASH_INDEX, 'hash', { unique: true })
}

export const dbRequest = openDB('know', 1, {
    upgrade: (db) => {
        v1(db)
    }
})