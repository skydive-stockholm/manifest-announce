<script setup lang="ts">
import { ExclamationTriangleIcon } from "@heroicons/vue/24/solid"
</script>

<template>
    <div
        class="flex items-center gap-5 rounded-lg bg-orange-600 p-4 text-xl text-white"
    >
        <ExclamationTriangleIcon class="h-8 w-8 text-yellow-300" />
        <slot />
    </div>
</template>
