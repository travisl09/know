import { dbRequest, TITLES_STORE, FILES_STORE } from "./db";
import { Files, FileRecord, PageTypes } from "./files";

export class Title {
    // id = undefined
    /**
     * @param {string} name 
     * @param {string} path 
     * @param {number} txtFileId 
     * @param {number} srcFileId 
     * @param {string} srcUrl 
     */
    constructor(name, path, txtFileId, srcFileId, srcUrl) {
        this.name = name;
        this.path = path;
        this.txtFileId = txtFileId
        this.srcFileId = srcFileId
        this.srcUrl = srcUrl
    }
}


export class Titles {

    async getTitles() {
        let db = await dbRequest
        return await db.getAll(TITLES_STORE)
    }
    /**
     * 
     * @param {number} titleId 
     * @param {number} [txtFileId]
     * @param {number} [srcFileId]
     */
    async deleteTitle(titleId, txtFileId, srcFileId){
        const db = await dbRequest
        const tx = db.transaction([TITLES_STORE, FILES_STORE], 'readwrite')
        if (titleId > 0) {
            const titleStore = tx.objectStore(TITLES_STORE)
            await titleStore.delete(titleId)
        }
        const fileStore = tx.objectStore(FILES_STORE)
        if (txtFileId > 0) {
            await fileStore.delete(txtFileId)
        }
        if (srcFileId > 0) {
            await fileStore.delete(srcFileId)
        }
        await tx.done
    }
    /**
     * 
     * @param {Title} title 
     * @param {Blob} txtBlob 
     * @param {string} pageType
     * @param {Blob} [srcBlob]
     * @returns {Promise<Title>} updated title object
     */
    async addTitle(title, txtBlob, pageType, srcBlob) {
        this.#validateAddTitle(title, txtBlob)
        const db = await dbRequest
        let txtFile = await FileRecord.new(txtBlob, pageType)
        let srcFile = srcBlob && srcBlob.size ? await FileRecord.new(srcBlob, PageTypes.NONE) : undefined
        const tx = db.transaction([FILES_STORE, TITLES_STORE], 'readwrite')
        const fileStore =  tx.objectStore(FILES_STORE)
        const fileRepo = new Files()
        title.txtFileId = await fileRepo.addFile(txtFile, fileStore)
        if (srcBlob && srcBlob.size) {
            title.srcFileId = await fileRepo.addFile(srcFile, fileStore)
        }
        const titleStore = tx.objectStore(TITLES_STORE)
        title.id = await titleStore.add(title)
        await tx.done
        return title
    }
    /**
     * 
     * @param {Title} title 
     * @param {Blob} txtBlob 
     * @returns 
     */
    #validateAddTitle(title, txtBlob) {
        if (!(title && title.name && txtBlob && txtBlob.size))
            throw Error('Title must have a name and text file')
    }
}