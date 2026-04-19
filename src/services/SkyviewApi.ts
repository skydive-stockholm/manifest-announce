import axios, { AxiosBasicCredentials } from "axios"

export class SkyviewApi {
    apiUrl: string
    auth?: AxiosBasicCredentials

    constructor(apiUrl: string, auth?: AxiosBasicCredentials) {
        this.apiUrl = apiUrl
        this.auth = auth

        if (this.apiUrl.includes("demo.skywin.se")) {
            const CORS_PROXY = "https://corsproxy.io/?url="

            this.apiUrl = `${CORS_PROXY}${this.apiUrl}`
        }
    }

    async get() {
        if (!this.apiUrl) {
            return
        }

        const res = await axios.get(`${this.apiUrl}/api/v1/skyview.json`, {
            auth: this.auth,
        })

        return await res.data
    }
}
