import axios from "axios"

export class SkyviewApi {
    apiUrl: string

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl

        if (this.apiUrl.includes("demo.skywin.se")) {
            const CORS_PROXY = "https://corsproxy.io/?url="

            this.apiUrl = `${CORS_PROXY}${this.apiUrl}`
        }
    }

    async get() {
        const res = await axios.get(`${this.apiUrl}/api/v1/skyview.json`)

        return await res.data
    }
}
