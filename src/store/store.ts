import { createGlobalState, useStorage } from "@vueuse/core"
import { watch } from "vue"
import { VoiceServiceType } from "../composables/useTextToSpeech.ts"

type DefinedGate = {
    name: string
}

export const useGlobalState = createGlobalState(() => {
    const store = useStorage(
        "settings",
        {
            definedGates: [] as DefinedGate[],
            selectedGate: null,
            core: {
                skywin_endpoint: "https://demo.skywin.se",
                aws_polly_key: "",
                elevenlabs_key: "",
            },
            voiceService: "" as VoiceServiceType,
            voiceServices: {
                elevenlabs: {
                    voice: "",
                },
                polly: {
                    voice: "",
                },
                native: {
                    voice: "",
                    rate: 1,
                    pitch: 1,
                    volume: 1,
                },
            },
        },
        window.localStorage,
        {
            mergeDefaults: true,
        }
    )

    // Reset selected gate when defined gates change
    watch(
        store.value.definedGates,
        () => {
            store.value.selectedGate = null
        },
        { deep: true }
    )

    return store
})
