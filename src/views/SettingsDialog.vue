<script setup lang="ts">
import { useConfirmDialog } from "@vueuse/core"
import BaseButton from "../components/BaseButton.vue"
import GateSetting from "./GateSetting.vue"
import APISetting from "./CoreSetting.vue"

const { isRevealed, reveal, confirm, cancel } = useConfirmDialog()

const handleClickOutside = () => {
    cancel()
}

defineExpose({ reveal })
</script>

<template>
    <div
        class="relative z-10"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
        v-if="isRevealed"
    >
        <div
            class="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/90 transition-opacity"
            aria-hidden="true"
            @click="handleClickOutside"
        ></div>

        <div
            class="fixed inset-0 z-10 w-screen overflow-y-auto pointer-events-none"
        >
            <div
                class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 pointer-events-none"
            >
                <div
                    class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-700 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg pointer-events-auto"
                >
                    <div class="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div
                            class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left"
                        >
                            <h3
                                class="text-base font-semibold text-gray-900 dark:text-gray-300 flex gap-2"
                                id="modal-title"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="size-6 text-gray-600 dark:text-gray-400"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                                    />
                                </svg>

                                Settings
                            </h3>
                            <div class="mt-2">
                                <p
                                    class="text-sm text-gray-500 dark:text-gray-400"
                                >
                                    Settings are only persisted in the browser
                                    storage. If you clear your browser storage,
                                    you will have to start over.
                                </p>
                            </div>

                            <hr class="my-3" />

                            <form @submit="confirm" class="space-y-3">
                                <GateSetting />
                                <hr />
                                <APISetting />
                            </form>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div
                        class="bg-gray-50 dark:bg-gray-700 dark:border-t dark:border-gray-600 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
                    >
                        <BaseButton type="button" @click="confirm" size="large">
                            Done
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
