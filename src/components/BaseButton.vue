<template>
    <button
        class="flex gap-2 items-center font-medium py-2 px-4 rounded print:hidden disabled:opacity-60"
        :class="[colorClasses, sizeClasses]"
    >
        <component :is="icon" class="w-5 h-5" />
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
import { computed, Component as VueComponent } from "vue"

type ButtonColor = "blue" | "green" | "red" | "yellow" | "gray" | "orange"

type ButtonSize = "small" | "medium" | "large"

type ButtonProps = {
    icon?: VueComponent | null
    color?: ButtonColor
    size?: ButtonSize
}

const props = withDefaults(defineProps<ButtonProps>(), {
    icon: null,
    color: "blue",
    size: "medium",
})

const sizeClasses = computed((): string => {
    switch (props.size) {
        case "small":
            return "text-sm py-2 px-3"
        case "large":
            return "text-lg py-2 px-5"
        case "medium":
        default:
            return "text-base py-2 px-4"
    }
})

const colorClasses = computed((): string => {
    switch (props.color) {
        case "blue":
            return "bg-blue-700 hover:bg-blue-800 dark:hover:bg-blue-600 text-white"
        case "green":
            return "bg-green-600 hover:bg-green-700 dark:hover:bg-green-500 text-white"
        case "red":
            return "bg-red-700 hover:bg-red-800 dark:hover:bg-red-600 text-white"
        case "yellow":
            return "bg-yellow-600 hover:bg-yellow-800 dark:hover:bg-yellow-600 text-white"
        case "gray":
            return "bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white"
        case "orange":
            return "bg-orange-700 hover:bg-orange-800 dark:hover:bg-orange-600 text-white"
        // Default case to satisfy TypeScript
        default:
            return "bg-blue-700 hover:bg-blue-800 dark:hover:bg-blue-600 text-white"
    }
})
</script>
