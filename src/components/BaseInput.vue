<template>
    <label class="flex flex-col mb-2 font-medium">
        <span v-if="label" class="block mb-1 text-sm font-normal">
            {{ label }}
        </span>

        <input
            @focus="handleFocus"
            class="rounded font-normal w-full border-0 bg-gray-200 dark:bg-gray-800 dark:text-gray-200 px-3 py-2 outline-0"
            type="text"
            :value="modelValue"
            v-bind="$attrs"
            @input="handleInput"
        />
    </label>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue"

defineProps<{
    modelValue?: string | number
    label?: string
}>()

const emit = defineEmits<{
    (e: "update:modelValue", value: string | number): void
}>()

const handleFocus = (event: FocusEvent) => {
    const target = event.target as HTMLInputElement
    target?.select()
}

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit("update:modelValue", target.value)
}
</script>
