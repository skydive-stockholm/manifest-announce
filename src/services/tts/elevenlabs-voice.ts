import { BaseVoiceService } from "./base-voice.ts"
import { VoiceOptions } from "../../types.ts"

export class ElevenLabsVoiceService extends BaseVoiceService {
    protected name = "ElevenLabs"
    private apiKey: string
    private baseUrl = "https://api.elevenlabs.io/v1"
    private modelId = "eleven_turbo_v2_5" // alt: eleven_multilingual_v2,
    private audioCache: Map<string, HTMLAudioElement> = new Map()

    constructor(apiKey: string, options: VoiceOptions = {}) {
        super(options)

        this.options.voice = this.options.voice || "nPczCjzI2devNBz1zQrb" // Default voice ID
        this.apiKey = apiKey
    }

    async speak(text: string): Promise<void> {
        try {
            const audio = await this.getAudio(text)
            return this.playAudio(audio)
        } catch (error) {
            return this.handleError(error)
        }
    }

    private async getAudio(text: string): Promise<HTMLAudioElement> {
        const cacheKey = `${text}-${JSON.stringify(this.options)}`

        if (this.audioCache.has(cacheKey)) {
            return this.audioCache.get(cacheKey)!
        }

        const url = `${this.baseUrl}/text-to-speech/${this.options.voice}`

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "xi-api-key": this.apiKey,
            },
            body: JSON.stringify({
                text,
                model_id: this.modelId,
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                },
            }),
        })

        if (!response.ok) {
            throw new Error(`ElevenLabs API error: ${response.statusText}`)
        }

        const blob = await response.blob()
        const audioUrl = URL.createObjectURL(blob)
        const audio = new Audio(audioUrl)
        audio.preload = "auto"

        this.audioCache.set(cacheKey, audio)
        return audio
    }

    private playAudio(audio: HTMLAudioElement): Promise<void> {
        return new Promise((resolve, reject) => {
            audio.onended = () => resolve()
            audio.onerror = reject
            audio.play().catch(reject)
        })
    }

    async isAvailable(): Promise<boolean> {
        return navigator.onLine && Boolean(this.apiKey)
    }
}
