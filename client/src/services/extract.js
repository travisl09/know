
const apiUrl = import.meta.env.VITE_KNOW_API_URL + '/extract'
const extractFileUrlPath = apiUrl + '/file'
const extractUrlPath = apiUrl + '/url/'


export async function file(file) {
    const formData = new FormData()
    formData.append('file', file)
    return await fetch(extractFileUrlPath, {
        method: 'POST',
        body: formData
    })
}

export async function url(url) {
    return await fetch(extractUrlPath + url)
}
