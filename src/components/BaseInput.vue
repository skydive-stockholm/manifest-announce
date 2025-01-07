<template>
    <label class="flex flex-col mb-2 font-medium">
        <span v-if="label" class="block mb-1 text-sm font-normal">
            {{ label }}
        </span>

        <input
            @focus="$event.target.select()"
            class="rounded font-normal w-full border-0 bg-gray-200 dark:bg-gray-800 dark:text-gray-200 px-3 py-2 outline-0"
            type="text"
            :value="modelValue"
            v-bind="$attrs"
            @input="$emit('update:modelValue', $event.target.value)"
        />
    </label>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue"

defineProps<{
    modelValue?: string | number
    label?: string
}>()

defineEmits<{
    (e: "update:modelValue", value: string | number): void
}>()
</script>
