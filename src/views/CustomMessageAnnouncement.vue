<script setup lang="ts">
import { ref } from "vue"
import { isPlayingSound, play } from "../utils/sound.ts"

const customMessageBellSound = ref(true)
const customMessage = ref("")
</script>

<template>
    <div class="flex gap-5">
        <div>
            <label
                for="custom-message"
                class="block uppercase text-xs font-semibold mb-1"
            >
                Custom message
                <small>(<kbd>ctrl + enter</kbd>)</small>
            </label>

            <textarea
                rows="4"
                @keydown.meta.enter.exact="play(customMessage)"
                v-model="customMessage"
                class="rounded border-0 p-2 bg-gray-200 dark:bg-gray-800 dark:text-gray-200 w-full"
                id="custom-message"
                placeholder="Tell the world something..."
            ></textarea>
        </div>

        <div>
            <label>&nbsp;</label>
            <button
                class="block bg-blue-600 text-white px-8 py-6 text-xl rounded hover:bg-opacity-90 focus:bg-opacity-80"
                :class="{
                    'bg-opacity-30 hover:bg-opacity-30 cursor-not-allowed':
                        isPlayingSound,
                }"
                :disabled="isPlayingSound"
                id="custom-message__submit"
                @click="play(customMessage, customMessageBellSound)"
            >
                Play
            </button>

            <div class="flex items-center mt-2">
                <label
                    for="custom-message__bell-sound"
                    class="uppercase text-xs font-semibold mr-2"
                >
                    Bell sound
                </label>

                <input
                    v-model="customMessageBellSound"
                    type="checkbox"
                    checked
                    id="custom-message__bell-sound"
                />
            </div>
        </div>
    </div>
</template>
