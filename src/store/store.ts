import { createGlobalState, useStorage } from "@vueuse/core"
import { watch } from "vue"

export const useGlobalState = createGlobalState(() => {
    const store = useStorage(
        "settings",
        {
            definedGates: [],
            selectedGate: null,
            core: {
                skywin_endpoint: null,
                aws_polly_key: null,
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
