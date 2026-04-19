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

        const now = new Date()
        const jumpDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`

        const res = await axios.get(`${this.apiUrl}/api/v1/skyview.json`, {
            auth: this.auth,
            params: { jumpDate },
        })

        return await res.data
    }
}
