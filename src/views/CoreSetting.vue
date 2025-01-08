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
                Core settings
            </h3>
        </header>

        <div class="mt-3">
            <BaseInput
                label="SkyWin One endpoint"
                placeholder="http://localhost:1234"
                v-model="state.core.skywin_endpoint"
            />
        </div>
    </section>
</template>
