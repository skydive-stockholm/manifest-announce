export interface VoiceOptions {
    rate?: number | string
    pitch?: number
    volume?: number
    voice?: string
    language?: string
}

export interface VoiceService {
    speak(text: string): Promise<void>
    preload?(text: string): Promise<void>
    isAvailable(): Promise<boolean>
}
