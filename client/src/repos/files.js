import { dbRequest, FILES_STORE } from "./db";

export class FileRecord {
    // id = undefined
    hash

    /**
     * 
     * @param {Blob} blob 
     * @param {string} pageType
     */
    constructor(blob, pageType) {
        this.blob = blob
        this.pageType = pageType || PageTypes.NONE
    }
    static async new(blob, pageType){
        const record = new FileRecord(blob, pageType)
        record.hash = await FileRecord.hashBlob(blob)
        return record
    }
    /**
     * 
     * @param {Blob} blob 
     */
    static async hashBlob(blob) {
        const buffer = await blob.arrayBuffer()
        const bufferHash = await crypto.subtle.digest('SHA-256', buffer)
        const byteView = new Uint8Array(bufferHash)
        return Array.from(byteView)
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('')
    }
}
export const PageTypes = Object.freeze({
    FORM_FEED: 'formfeed',
    NONE: 'none'
})

export class Files {

    async getFile(id) {
        const db = await dbRequest
        return await db.get(FILES_STORE, id)
    }
    /**
     * 
     * @param {FileRecord} fileRecord 
     * @param {import("idb").IDBPObjectStore} [store]
     */
    async addFile(fileRecord, store) {
        fileRecord.hash = fileRecord.hash || await FileRecord.hashBlob(fileRecord.blob)
        store = store || (await dbRequest).transaction(FILES_STORE, 'readwrite').store
        const existing = await store.index('hash').get(fileRecord.hash)
        return fileRecord.id = existing ? existing.id : await store.add(fileRecord)
    }
}