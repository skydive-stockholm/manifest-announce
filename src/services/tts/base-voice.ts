import { VoiceOptions, VoiceService } from "../../types.ts"

export abstract class BaseVoiceService implements VoiceService {
    protected abstract name: string
    protected options: VoiceOptions

    protected constructor(options: VoiceOptions = {}) {
        this.options = options
    }

    abstract speak(text: string): Promise<void>

    async isAvailable(): Promise<boolean> {
        return true
    }

    protected async handleError(error: unknown): Promise<never> {
        console.error(`Error in ${this.name} voice service:`, error)
        throw error
    }
}
