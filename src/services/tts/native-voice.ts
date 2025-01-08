import { BaseVoiceService } from "./base-voice.ts"
import { VoiceOptions } from "../../types.ts"

export class NativeVoiceService extends BaseVoiceService {
    protected name = "Native Speech"
    private timeoutResumeInfinity?: number

    constructor(options: VoiceOptions = {}) {
        super({
            rate: 0.85,
            pitch: 1,
            volume: 1,
            language: "en-US",
            ...options,
        })
    }

    private resumeInfinity() {
        window.speechSynthesis.pause()
        window.speechSynthesis.resume()
        this.timeoutResumeInfinity = setTimeout(
            () => this.resumeInfinity(),
            4000
        )
    }

    async speak(text: string): Promise<void> {
        try {
            return await new Promise((resolve, reject) => {
                const utterance = new SpeechSynthesisUtterance(text)
                utterance.lang = this.options.language || "en-US"
                utterance.rate =
                    typeof this.options.rate === "number"
                        ? this.options.rate
                        : 0.85
                utterance.pitch = this.options.pitch || 1
                utterance.volume = this.options.volume || 1

                utterance.onstart = () => {
                    this.resumeInfinity()
                }

                utterance.onend = () => {
                    clearTimeout(this.timeoutResumeInfinity)
                    resolve()
                }

                utterance.onerror = (event) => {
                    clearTimeout(this.timeoutResumeInfinity)
                    reject(event)
                }

                window.speechSynthesis.speak(utterance)
            })
        } catch (error) {
            return this.handleError(error)
        }
    }

    async isAvailable(): Promise<boolean> {
        return "speechSynthesis" in window
    }
}
