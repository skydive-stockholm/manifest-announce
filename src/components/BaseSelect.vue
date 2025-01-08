<template>
    <label class="flex flex-col mb-2 font-medium">
        <span v-if="label" class="block mb-1 text-sm font-normal">
            {{ label }}
        </span>

        <select
            class="rounded font-normal w-full border-0 bg-gray-200 dark:bg-gray-800 dark:text-gray-200 px-3 py-2 outline-0"
            :value="modelValue"
            v-bind="$attrs"
            @change="handleChange"
        >
            <option v-if="placeholder" selected disabled>
                {{ placeholder }}
            </option>

            <slot />
        </select>
    </label>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue"

defineProps<{
    modelValue?: string | number
    label?: string
    placeholder?: string
}>()

const emit = defineEmits<{
    (e: "update:modelValue", value: string | number): void
}>()

const handleChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    emit("update:modelValue", target.value)
}
</script>
