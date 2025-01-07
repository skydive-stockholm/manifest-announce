import { getPollyAudioUrl } from "./polly.ts"
import bellAudioUrl from "../assets/bell.mp3"
import { ref } from "vue"

window.speechSynthesis.getVoices()
let timeoutResumeInfinity: number

export const isPlayingSound = ref(false)

const nativeSpeechSynthesis = async (text: string): Promise<void> => {
    function resumeInfinity() {
        window.speechSynthesis.pause()
        window.speechSynthesis.resume()
        timeoutResumeInfinity = setTimeout(resumeInfinity, 4000)
    }

    return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = "en-US"

        utterance.rate = 0.85
        utterance.pitch = 1
        utterance.volume = 1
        utterance.onstart = () => {
            resumeInfinity()
        }

        utterance.onend = () => {
            resolve()
            clearTimeout(timeoutResumeInfinity)
        }
        window.speechSynthesis.speak(utterance)
    })
}

const preloadAudio = (url: string) => {
    return new Promise(function (resolve, reject) {
        let audio = new Audio()
        audio.preload = "auto"
        audio.src = url
        audio.onerror = reject

        audio.oncanplaythrough = () => resolve(audio)
    })
}

export const playSoundFromUrl = (url: string) => {
    return new Promise(function (resolve, reject) {
        let audio = new Audio()
        audio.preload = "auto"
        audio.src = url
        audio.autoplay = true
        audio.onerror = reject

        audio.onended = () => resolve(audio)
    })
}

export const play = async (text: string, bellSound = false) => {
    try {
        isPlayingSound.value = true

        // Prepare Polly audio if online
        const pollyPromise = navigator.onLine
            ? (async () => {
                  const pollyUrl = await getPollyAudioUrl(text)
                  return preloadAudio(pollyUrl)
              })()
            : null

        // Play bell sound if requested
        if (bellSound) {
            await playSoundFromUrl(bellAudioUrl)
        }

        // Fallback for offline or Polly unavailable
        if (!navigator.onLine) {
            return nativeSpeechSynthesis(text)
        }

        return pollyPromise
            .then(async (pollyAudio) => {
                pollyAudio = await pollyPromise

                return pollyAudio?.play()
            })
            .catch(() => {
                return nativeSpeechSynthesis(text)
            })
    } catch (error) {
        console.error("Error in play function:", error)
    } finally {
        isPlayingSound.value = false
    }
}
