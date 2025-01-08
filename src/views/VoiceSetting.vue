<script setup lang="ts">
import { PlayCircleIcon } from "@heroicons/vue/24/solid"
import BaseInput from "../components/BaseInput.vue"
import { useGlobalState } from "../store/store.ts"
import BaseSelect from "../components/BaseSelect.vue"
import { ref } from "vue"
import BaseButton from "../components/BaseButton.vue"

const state = useGlobalState()

const elevenLabsVoices = ref<Array<Voice>>([])

type VoiceLabels = {
    accent: string
    description: string
    age: string
    gender: string
    use_case: string
}

type Voice = {
    voice_id: string
    name: string
    samples: null
    category: string
    labels: VoiceLabels
    description: string | null
    preview_url: string
    available_for_tiers: string[]
    settings: null
    sharing: null
    high_quality_base_model_ids: string[]
    safety_control: null
    permission_on_resource: null
    is_owner: boolean
    is_legacy: boolean
    is_mixed: boolean
    created_at_unix: number | null
}

// Fetch ElevenLabs voices
fetch("https://api.elevenlabs.io/v1/voices")
    .then((response) => response.json())
    .then((data) => {
        elevenLabsVoices.value = data.voices
    })
    .catch((error) => {
        console.error("Error:", error)
    })

// Polly voices
const pollyVoices = [
    { name: "Amy", language: "British", gender: "Female" },
    { name: "Emma", language: "British", gender: "Female" },
    { name: "Brian", language: "British", gender: "Male" },
    { name: "Arthur", language: "British", gender: "Male" },

    { name: "Danielle", language: "American", gender: "Female" },
    { name: "Gregory", language: "American", gender: "Male" },
    { name: "Joanna", language: "American", gender: "Female" },
    { name: "Kendra", language: "American", gender: "Female" },
    { name: "Joey", language: "American", gender: "Male" },
    { name: "Matthew", language: "American", gender: "Male" },
    { name: "Ruth", language: "American", gender: "Female" },
    { name: "Stephen", language: "American", gender: "Male" },
]

const audio = new Audio()
const isPlayingPreview = ref(false)
function playPreview(url: string): void {
    if (isPlayingPreview.value === true) {
        audio.pause()
    }

    audio.src = url
    isPlayingPreview.value = true

    audio.play()

    audio.onended = () => {
        isPlayingPreview.value = false
    }
}
</script>

<template>
    <section>
        <header>
            <h3
                class="text-sm font-semibold text-gray-900 dark:text-gray-300"
                id="modal-title"
            >
                Core settings
            </h3>

            <div class="mt-0">
                <p class="text-xs text-gray-500 dark:text-gray-400">
                    Changing these settings will reset the entire application
                </p>
            </div>
        </header>

        <div class="mt-3">
            <BaseSelect v-model="state.voiceService" label="Voice service">
                <option value="native">Native browser</option>
                <option value="polly">AWS Polly</option>
                <option value="elevenlabs">Elevenlabs</option>
            </BaseSelect>

            <BaseInput
                v-if="state.voiceService === 'polly'"
                label="AWS Polly identity pool"
                placeholder="eu-central-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx"
                v-model="state.core.aws_polly_key"
            />

            <BaseSelect
                v-if="state.voiceService === 'polly'"
                v-model="state.voiceServices.polly.voice"
                label="Polly voice"
                placeholder="Select a voice"
            >
                <option
                    v-for="voice in pollyVoices"
                    :value="voice.name"
                    :key="voice.name"
                >
                    {{ voice.name }} – {{ voice.language }} {{ voice.gender }}
                </option>
            </BaseSelect>

            <BaseInput
                v-if="state.voiceService === 'elevenlabs'"
                label="Elevenlabs key"
                placeholder="sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                v-model="state.core.elevenlabs_key"
            />

            <div v-if="state.voiceService === 'elevenlabs'" class="space-y-2">
                <div
                    v-for="voice in elevenLabsVoices"
                    :key="voice.voice_id"
                    class="group flex gap-4 items-center py-1 px-3 border bg-gray-100 dark:bg-gray-600 dark:border-gray-500 rounded-md dark:hover:border-blue-200 dark:hover:bg-gray-800 cursor-default"
                    :class="{
                        '!border-blue-500 !bg-blue-600 text-white':
                            state.voiceServices.elevenlabs.voice ===
                            voice.voice_id,
                    }"
                >
                    <PlayCircleIcon
                        class="h-5 w-5 cursor-pointer hover:text-blue-500"
                        :disabled="isPlayingPreview"
                        @click="playPreview(voice.preview_url)"
                    />

                    <div>
                        <div class="font-medium">{{ voice.name }}</div>

                        <div class="flex gap-3">
                            {{ voice.labels.description }}
                            {{ voice.labels.accent }}
                            {{ voice.labels.gender }}
                        </div>
                    </div>

                    <BaseButton
                        v-if="
                            state.voiceServices.elevenlabs.voice !==
                            voice.voice_id
                        "
                        class="group-hover:visible invisible ml-auto"
                        size="tiny"
                        @click="
                            state.voiceServices.elevenlabs.voice =
                                voice.voice_id
                        "
                        type="button"
                        >Select
                    </BaseButton>
                </div>
            </div>
        </div>
    </section>
</template>
