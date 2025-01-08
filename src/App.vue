<script setup lang="ts">
import Manifest from "./views/Manifest.vue"
</script>

<template>
    <div class="container p-8 mx-auto">
        <h1
            class="flex items-center text-lg font-light border-b dark:border-zinc-700 pb-4 mb-8"
        >
            Manifest Announcements

            <a
                href="https://skydive.se"
                class="ml-auto font-medium text-sm opacity-50 hover:opacity-100"
            >
                💙 SF
            </a>
        </h1>

        <Manifest />
    </div>
</template>
