<script setup lang="ts">
import BaseInput from "../components/BaseInput.vue"
import BaseSwitch from "../components/BaseSwitch.vue"
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

            <div class="mt-3">
                <BaseSwitch
                    label="Basic authentication"
                    v-model="state.core.skywin_basic_auth_enabled"
                />
            </div>

            <div v-if="state.core.skywin_basic_auth_enabled" class="mt-3">
                <BaseInput
                    label="Username"
                    autocomplete="off"
                    v-model="state.core.skywin_username"
                />
                <BaseInput
                    label="Password"
                    type="password"
                    autocomplete="new-password"
                    v-model="state.core.skywin_password"
                />
            </div>
        </div>
    </section>
</template>
