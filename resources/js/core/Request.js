import request from "@/utils";


export class Request {
    static async _post(url = '', body = {}, message = {}) {
        return await request(url, 'POST', body, { enabled: true, ...message })
    }

    static async _get(url = '', message = {}) {
        return await request(url, 'GET', {}, { enabled: true, ...message })
    }

    static async _put(url = '', body = {}, message = {}) {
        return await request(url, 'PUT', body, { enabled: true, ...message })
    }

    static async _delete(url = '', message = {}) {
        return await request(url, 'GET', {}, { enabled: true, ...message })
    }
}