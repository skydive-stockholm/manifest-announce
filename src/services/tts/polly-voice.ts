import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity"
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity"
import { Polly, SynthesizeSpeechInput, VoiceId } from "@aws-sdk/client-polly"
import { getSynthesizeSpeechUrl } from "@aws-sdk/polly-request-presigner"
import { VoiceOptions } from "../../types"
import { BaseVoiceService } from "./base-voice"

interface PollySpecificOptions {
    rate?: "x-slow" | "slow" | "medium" | "fast" | "x-fast"
    voice?: VoiceId
}

export class PollyVoiceService extends BaseVoiceService {
    protected name = "AWS Polly"
    private pollyIdentityPoolId: string
    private pollyRegion: string
    private audioCache: Map<string, HTMLAudioElement> = new Map()
    private voiceOptions: PollySpecificOptions

    constructor(apiKey: string, region: string, options: VoiceOptions = {}) {
        super()
        this.pollyIdentityPoolId = apiKey
        this.pollyRegion = region
        this.voiceOptions = this.mapToPollyOptions(options)
    }

    async speak(text: string): Promise<void> {
        try {
            const audio = await this.getAudio(text)
            return this.playAudio(audio)
        } catch (error) {
            return this.handleError(error)
        }
    }

    async preload(text: string): Promise<void> {
        await this.getAudio(text)
    }

    async isAvailable(): Promise<boolean> {
        return navigator.onLine && Boolean(this.pollyIdentityPoolId)
    }

    private createPollyClient(): Polly {
        return new Polly({
            region: this.pollyRegion,
            credentials: fromCognitoIdentityPool({
                client: new CognitoIdentityClient({ region: this.pollyRegion }),
                identityPoolId: this.pollyIdentityPoolId,
            }),
        })
    }

    private mapToPollyOptions(options: VoiceOptions): PollySpecificOptions {
        let pollyRate: "x-slow" | "slow" | "medium" | "fast" | "x-fast" =
            "medium"
        if (typeof options.rate === "number") {
            if (options.rate <= 0.5) pollyRate = "x-slow"
            else if (options.rate <= 0.8) pollyRate = "slow"
            else if (options.rate <= 1.2) pollyRate = "medium"
            else if (options.rate <= 1.5) pollyRate = "fast"
            else pollyRate = "x-fast"
        }

        return {
            rate: pollyRate,
            voice: (options.voice as VoiceId) || "Amy",
        }
    }

    private async getAudio(text: string): Promise<HTMLAudioElement> {
        const cacheKey = `${text}-${JSON.stringify(this.voiceOptions)}`

        if (this.audioCache.has(cacheKey)) {
            return this.audioCache.get(cacheKey)!
        }

        const url = await this.getPollyAudioUrl(text)
        const audio = new Audio(url)
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

    private async getPollyAudioUrl(text: string): Promise<string> {
        if (!this.pollyIdentityPoolId) {
            throw new Error("Polly Identity Pool ID is not configured")
        }

        const client = this.createPollyClient()
        const wrappedText = `<speak><prosody rate="${this.voiceOptions.rate}">${text}</prosody></speak>`

        const params: SynthesizeSpeechInput = {
            Text: wrappedText,
            TextType: "ssml",
            VoiceId: this.voiceOptions.voice || "Amy",
            OutputFormat: "mp3",
            Engine: "neural",
        }

        // @ts-ignore  Stupid AWS SDK types...
        return getSynthesizeSpeechUrl({
            client,
            params,
        })
    }
}
