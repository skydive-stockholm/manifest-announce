<script setup lang="ts">
import BaseInput from "../components/BaseInput.vue"
import { useGlobalState } from "../store/store.ts"

const state = useGlobalState()
</script>

<template>
    <section>
        <header>
            <h3
                class="text-sm font-semibold text-gray-900 dark:text-gray-300"
                id="modal-title"
            >
                Gates
            </h3>

            <div class="mt-0">
                <p class="text-xs text-gray-500 dark:text-gray-400">
                    Changing gates will reset the selected gate
                </p>
            </div>
        </header>

        <div
            class="flex items-center gap-3 mt-1"
            v-for="(gate, index) in state.definedGates"
        >
            <BaseInput
                placeholder="North, south, gate 1, etc."
                v-model="gate.name"
                class="mb-0"
            />

            <button
                tabindex="-1"
                class="text-gray-400 hover:text-red-500"
                title="Delete gate"
                type="button"
                @click="state.definedGates.splice(index, 1)"
            >
                &cross;
            </button>
        </div>

        <button
            class="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 hover:underline text-sm"
            type="button"
            @click="
                state.definedGates.push({
                    name: '',
                })
            "
        >
            &plus; Add gate
        </button>
    </section>
</template>
