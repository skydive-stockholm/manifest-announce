<script setup lang="ts">
import { useGlobalState } from "../store/store.ts"

const state = useGlobalState()
</script>

<template>
    <div>
        <label
            class="dark:text-gray-400 block uppercase text-xs font-semibold mb-1"
        >
            Gate
        </label>

        <div class="flex gap-2" v-if="state.definedGates.length">
            <label
                class="mr-2 mb-1 block"
                v-for="definedGate in state.definedGates"
            >
                <input
                    type="radio"
                    v-model="state.selectedGate"
                    :value="definedGate.name"
                />

                {{ definedGate.name }}
            </label>
        </div>
    </div>
</template>
