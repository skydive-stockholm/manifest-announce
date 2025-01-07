<script setup lang="ts">
import BaseInput from "../components/BaseInput.vue"
import { useGlobalState } from "../store/store.ts"

const state = useGlobalState()

function onBlur() {
    window.location.reload()
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
            <BaseInput
                label="SkyWin One endpoint"
                placeholder="http://localhost:1234"
                v-model="state.core.skywin_endpoint"
                @blur="onBlur"
            />
            <BaseInput
                label="AWS Polly identity pool"
                placeholder="eu-central-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx"
                v-model="state.core.aws_polly_key"
                @blur="onBlur"
            />
        </div>
    </section>
</template>
