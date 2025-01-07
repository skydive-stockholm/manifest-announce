<template>
    <SwitchGroup as="div">
        <SwitchLabel
            class="dark:text-gray-400 block uppercase text-xs font-semibold mb-1"
            passive
        >
            {{ label }}
        </SwitchLabel>

        <Switch
            :model-value="modelValue"
            @update:model-value="$emit('update:modelValue', $event)"
            class="relative inline-flex items-center h-6 rounded-full w-11"
            :class="modelValue ? 'bg-teal-600' : 'bg-gray-500'"
        >
            <span
                class="inline-block w-4 h-4 bg-white rounded-full transition duration-200 ease-in-out transform"
                :class="modelValue ? 'translate-x-6' : 'translate-x-1'"
            />
        </Switch>
    </SwitchGroup>
</template>

<script setup lang="ts">
import { Switch, SwitchGroup, SwitchLabel } from "@headlessui/vue"
import { defineProps } from "vue"

defineProps<{
    modelValue: boolean
    label: string
}>()
</script>
