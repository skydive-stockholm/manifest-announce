import { ref, Ref } from "vue"
import bellAudioUrl from "../assets/bell.mp3"
import { NativeVoiceService } from "../services/tts/native-voice"
import { PollyVoiceService } from "../services/tts/polly-voice"
import { ElevenLabsVoiceService } from "../services/tts/elevenlabs-voice"
import { useGlobalState } from "../store/store"

export type VoiceServiceType = "native" | "polly" | "elevenlabs"

interface TextToSpeechConfig {
    service?: VoiceServiceType
    voice?: string
    rate?: number | string
    pitch?: number
    volume?: number
    language?: string
}

export const isPlayingSound: Ref<boolean> = ref(false)

export function useTextToSpeech(config: TextToSpeechConfig = {}) {
    const state = useGlobalState()

    async function playBellSound(): Promise<void> {
        const audio = new Audio(bellAudioUrl)
        return new Promise((resolve, reject) => {
            audio.onended = () => resolve()
            audio.onerror = reject
            audio.play().catch(reject)
        })
    }

    async function speak(text: string, options: { bellSound?: boolean } = {}) {
        const { bellSound = false } = options

        const pollyKey = state.value.core.aws_polly_key
        const pollyRegion = pollyKey.split(":")[0]
        const elevenLabsApiKey = state.value.core.elevenlabs_key

        const voiceService = state.value.voiceService || "native"
        const voiceServices = state.value.voiceServices

        const voice = config.voice || voiceServices[voiceService].voice

        // Initialize the services with the config
        const services = {
            native: new NativeVoiceService({
                voice: voice,
                rate: config.rate,
                pitch: config.pitch,
                volume: config.volume,
                language: config.language,
            }),
            polly: new PollyVoiceService(pollyKey, pollyRegion, {
                voice: voice,
                rate: config.rate,
            }),
            elevenlabs: new ElevenLabsVoiceService(elevenLabsApiKey, {
                voice: voice,
            }),
        }

        const currentService = config.service || voiceService || "native"

        try {
            isPlayingSound.value = true

            if (bellSound) {
                await playBellSound()
            }

            const selectedService = services[currentService]

            // Check if service is available, fall back to native if not
            if (!(await selectedService.isAvailable())) {
                return services.native.speak(text)
            }

            await selectedService.speak(text)
        } catch (error) {
            console.error("Error in speak function:", error)
            // Fallback to native speech on error
            if (currentService !== "native") {
                return services.native.speak(text)
            }
            throw error
        } finally {
            isPlayingSound.value = false
        }
    }

    return {
        speak,
        isPlayingSound,
    }
}
